import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, userId, roomId, message } = await req.json();
    console.log(`Matchmaking action: ${action}, userId: ${userId}`);

    switch (action) {
      case 'join_queue': {
        // Check if user is already in a room
        const { data: existingRoom } = await supabase
          .from('rooms')
          .select('*')
          .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
          .eq('status', 'active')
          .maybeSingle();

        if (existingRoom) {
          console.log('User already in active room:', existingRoom.id);
          return new Response(
            JSON.stringify({ success: true, room: existingRoom }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check for waiting users in queue
        const { data: waitingUsers } = await supabase
          .from('matchmaking_queue')
          .select('*')
          .neq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(1);

        if (waitingUsers && waitingUsers.length > 0) {
          const matchedUser = waitingUsers[0];
          console.log('Found match:', matchedUser.user_id);

          // Create room with both users
          const { data: newRoom, error: roomError } = await supabase
            .from('rooms')
            .insert({
              user1_id: matchedUser.user_id,
              user2_id: userId,
              status: 'active'
            })
            .select()
            .single();

          if (roomError) {
            console.error('Error creating room:', roomError);
            throw roomError;
          }

          // Remove matched user from queue
          await supabase
            .from('matchmaking_queue')
            .delete()
            .eq('user_id', matchedUser.user_id);

          // Remove current user from queue if they were in it
          await supabase
            .from('matchmaking_queue')
            .delete()
            .eq('user_id', userId);

          console.log('Room created:', newRoom.id);
          return new Response(
            JSON.stringify({ success: true, room: newRoom, matched: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // No match found, add to queue
        const { error: queueError } = await supabase
          .from('matchmaking_queue')
          .upsert({ user_id: userId }, { onConflict: 'user_id' });

        if (queueError) {
          console.error('Error joining queue:', queueError);
          throw queueError;
        }

        console.log('User added to queue');
        return new Response(
          JSON.stringify({ success: true, waiting: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'leave_queue': {
        await supabase
          .from('matchmaking_queue')
          .delete()
          .eq('user_id', userId);

        console.log('User left queue');
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'check_match': {
        // Check if user got matched while waiting
        const { data: room } = await supabase
          .from('rooms')
          .select('*')
          .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
          .eq('status', 'active')
          .maybeSingle();

        if (room) {
          // Remove from queue if still there
          await supabase
            .from('matchmaking_queue')
            .delete()
            .eq('user_id', userId);

          return new Response(
            JSON.stringify({ success: true, room, matched: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, waiting: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'leave_room': {
        if (!roomId) {
          throw new Error('Room ID required');
        }

        const { error } = await supabase
          .from('rooms')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
          .eq('id', roomId);

        if (error) throw error;

        console.log('Room ended:', roomId);
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'send_message': {
        if (!roomId || !message) {
          throw new Error('Room ID and message required');
        }

        const { data, error } = await supabase
          .from('messages')
          .insert({
            room_id: roomId,
            sender_id: userId,
            content: message
          })
          .select()
          .single();

        if (error) throw error;

        console.log('Message sent:', data.id);
        return new Response(
          JSON.stringify({ success: true, message: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_messages': {
        if (!roomId) {
          throw new Error('Room ID required');
        }

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, messages: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_online_count': {
        const { count } = await supabase
          .from('matchmaking_queue')
          .select('*', { count: 'exact', head: true });

        const { count: activeRooms } = await supabase
          .from('rooms')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        const totalOnline = (count || 0) + ((activeRooms || 0) * 2);

        return new Response(
          JSON.stringify({ success: true, count: totalOnline }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'send_signal': {
        const { signalType, signalData, receiverId } = await req.json();
        
        if (!roomId || !signalType || !signalData || !receiverId) {
          throw new Error('Room ID, signal type, signal data, and receiver ID required');
        }

        const { data, error } = await supabase
          .from('webrtc_signals')
          .insert({
            room_id: roomId,
            sender_id: userId,
            receiver_id: receiverId,
            signal_type: signalType,
            signal_data: signalData
          })
          .select()
          .single();

        if (error) throw error;

        console.log('Signal sent:', signalType);
        return new Response(
          JSON.stringify({ success: true, signal: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_signals': {
        if (!roomId) {
          throw new Error('Room ID required');
        }

        const { data, error } = await supabase
          .from('webrtc_signals')
          .select('*')
          .eq('room_id', roomId)
          .eq('receiver_id', userId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, signals: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'cleanup_signals': {
        if (!roomId) {
          throw new Error('Room ID required');
        }

        await supabase
          .from('webrtc_signals')
          .delete()
          .eq('room_id', roomId)
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

        console.log('Signals cleaned up for room:', roomId);
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Matchmaking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
