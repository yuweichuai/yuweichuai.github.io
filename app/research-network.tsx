import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetworkRuntime from "./network-runtime";

// Fixed paths show an illustrative flow from one post to several readers.
const routes = [
  "M8 60 H78 C111 60 113 25 154 25 H210 C239 25 250 60 282 60 H386 C421 60 426 23 467 23 H632",
  "M8 60 H632",
  "M8 60 H129 C162 60 169 97 207 97 H230 C253 97 257 60 282 60 H448 C479 60 485 97 523 97 H632",
  "M467 23 H499 C527 23 531 44 561 44 H597",
  "M523 97 H550 C575 97 580 79 605 79 H619",
];
const readers = [
  [78, 60], [129, 60], [154, 25], [207, 97], [386, 60], [448, 60],
  [467, 23], [499, 23], [523, 97], [550, 97], [597, 44], [619, 79],
  [632, 23], [632, 60], [632, 97],
];

export default function ResearchNetwork() {
  return (
    <figure className="research-network" data-research-network>
      <svg className="network-graph" viewBox="0 0 640 120" role="img" aria-label="Information flows from a post through successive branches of a network, with fact-checking and AI at its center.">
        <g className="network-routes">
          {routes.map((route) => <path key={route} d={route} />)}
        </g>
        <g className="network-signals" aria-hidden="true">
          {routes.map((route) => <path key={route} d={route} pathLength="100" />)}
        </g>
        {readers.map(([x, y]) => <circle key={`${x}-${y}`} className="network-reader" cx={x} cy={y} r="3.5" />)}
        <circle className="network-post" cx="8" cy="60" r="5" />
        <g className="network-symbol" transform="translate(294 60)" aria-hidden="true">
          <circle r="17" />
          <path d="M-7 0l5 5 9-10" />
        </g>
        <g className="network-symbol" transform="translate(346 60)" aria-hidden="true">
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
