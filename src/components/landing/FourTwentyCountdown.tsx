import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const getNext420 = (now: Date) => {
  const target = new Date(now);
  target.setHours(16, 20, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  return target;
};

const formatCountdown = (totalSeconds: number) => {
  const s = Math.max(0, totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const FourTwentyCountdown = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = useMemo(() => getNext420(now), [now]);
  const diffSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const is420Moment = now.getHours() === 16 && now.getMinutes() === 20;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="inline-flex"
          animate={is420Moment ? { scale: [1, 1.06, 1] } : undefined}
          transition={is420Moment ? { duration: 1.2, repeat: Infinity } : undefined}
        >
          <Badge
            variant="outline"
            className="glass px-3 py-1.5 gap-2 border-border/50 cursor-help"
          >
            <span className="font-display font-semibold text-primary">4:20</span>
            <span className="text-muted-foreground text-xs">
              {is420Moment ? "it\u2019s time" : formatCountdown(diffSeconds)}
            </span>
          </Badge>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px]">
        <div className="space-y-1">
          <p className="font-medium">Special surprise at 4:20.</p>
          <p className="text-xs text-muted-foreground">
            Come back at 4:20 PM and the app gets extra sparkly for a minute.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default FourTwentyCountdown;
