import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import NetworkRuntime from "./network-runtime";

// Reproducible organic geometry: an abstract emblem, never research data.
let seed = 91509;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const nodes: { x: number; y: number; z: number; size: number }[] = [];
for (let attempt = 0; nodes.length < 38 && attempt < 5000; attempt++) {
  const x = random() * 2 - 1;
  const y = random() * 2 - 1;
  const z = random() * 2 - 1;
  const radius = x * x + y * y + z * z;
  if (radius > 1 || radius < 0.09) continue;
  const point = { x: x * 104, y: y * 85, z: z * 75, size: 2.8 + random() * 1.7 };
  if (nodes.some((node) => Math.hypot(point.x - node.x, point.y - node.y, point.z - node.z) < 25)) continue;
  nodes.push(point);
}
const distance = (a: number, b: number) => Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y, nodes[a].z - nodes[b].z);
const links: [number, number][] = [];
const connected = new Set([0]);
const linkKeys = new Set<string>();
function addLink(a: number, b: number) {
  const from = Math.min(a, b), to = Math.max(a, b);
  const key = `${from}:${to}`;
  if (!linkKeys.has(key)) { linkKeys.add(key); links.push([from, to]); }
}
// First connect the whole cloud, then add short local connections.
while (connected.size < nodes.length) {
  let best: [number, number] = [0, 0];
  let shortest = Infinity;
  for (const from of connected) {
    nodes.forEach((_, to) => {
      if (!connected.has(to) && distance(from, to) < shortest) {
        shortest = distance(from, to); best = [from, to];
      }
    });
  }
  addLink(...best); connected.add(best[1]);
}
nodes.forEach((_, from) => {
  nodes.map((_, to) => to).filter((to) => to !== from)
    .sort((a, b) => distance(from, a) - distance(from, b)).slice(0, 3)
    .forEach((to) => addLink(from, to));
});
const project = (node: typeof nodes[number]) => {
  const scale = 340 / (340 - node.z);
  return { x: 160 + node.x * scale, y: 125 + node.y * scale, scale };
};
const points = nodes.map(project);
const signalEdges = Array.from({ length: 6 }, (_, index) => Math.floor(index * links.length / 6));

export default function ResearchNetwork() {
  return (
    <figure className="research-network" data-research-network>
      <figcaption className="sr-only">An abstract, animated information network.</figcaption>
      <svg className="network-graph" viewBox="0 0 320 250" role="img" aria-label="An organic network of connected blue points with depth and flowing light; a conceptual illustration, not research data.">
        <g className="network-edges">
          {links.map(([from, to], index) => (
            <line key={index} data-network-edge data-from={from} data-to={to} x1={points[from].x} y1={points[from].y} x2={points[to].x} y2={points[to].y} opacity={0.3} />
          ))}
        </g>
        <g className="network-nodes">
          {nodes.map((node, index) => (
            <g key={index} className={`network-particle${index % 6 === 0 ? " network-accent" : ""}`} data-network-node data-x={node.x} data-y={node.y} data-z={node.z} data-size={node.size} data-phase={index * 1.37} transform={`translate(${points[index].x} ${points[index].y})`}>
              <circle className="network-halo" r={node.size * points[index].scale * 2.8} opacity={0.1} />
              <circle className="network-core" r={node.size * points[index].scale} opacity={0.65 + node.z / 240} />
            </g>
          ))}
        </g>
        <g className="network-signals" aria-hidden="true">
          {signalEdges.map((edge, index) => (
            <circle key={edge} data-network-signal data-edge={edge} data-phase={index / 6} cx={points[links[edge][0]].x} cy={points[links[edge][0]].y} r={2.1} opacity={0} />
          ))}
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
