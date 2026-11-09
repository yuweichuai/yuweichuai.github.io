import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetworkRuntime from "./network-runtime";

// Fixed paths show an illustrative flow from one post to several readers.
const routes = [
  "M30 60 H78 C112 60 114 24 154 24 H189 C211 24 203 60 232 60 H290 C318 60 330 26 371 26 H440",
  "M30 60 H440",
  "M30 60 H78 C112 60 114 96 154 96 H189 C211 96 203 60 232 60 H290 C318 60 330 94 371 94 H440",
];
const readers = [[154, 24], [154, 96], [371, 26], [371, 94], [440, 26], [440, 60], [440, 94]];

export default function ResearchNetwork() {
  return (
    <figure className="research-network" data-research-network>
      <svg className="network-graph" viewBox="0 0 480 120" role="img" aria-label="Information flows from a post through a network, with fact-checking and AI at its center.">
        <g className="network-routes">
          {routes.map((route) => <path key={route} d={route} />)}
        </g>
        <g className="network-signals" aria-hidden="true">
          {routes.map((route) => <path key={route} d={route} pathLength="100" />)}
        </g>
        {readers.map(([x, y]) => <circle key={`${x}-${y}`} className="network-reader" cx={x} cy={y} r="3.5" />)}
        <circle className="network-post" cx="30" cy="60" r="5" />
        <g className="network-symbol" transform="translate(218 60)" aria-hidden="true">
          <circle r="17" />
          <path d="M-7 0l5 5 9-10" />
        </g>
        <g className="network-symbol" transform="translate(264 60)" aria-hidden="true">
          <circle r="17" />
          <text textAnchor="middle" dominantBaseline="central">AI</text>
        </g>
      </svg>
      <Button variant="ghost" size="icon" className="network-toggle" data-network-toggle hidden aria-label="Pause network animation" title="Pause network animation">
        <Pause className="network-pause-icon" size={13} aria-hidden="true" />
        <Play className="network-play-icon" size={13} aria-hidden="true" />
      </Button>
      <NetworkRuntime />
    </figure>
  );
}
