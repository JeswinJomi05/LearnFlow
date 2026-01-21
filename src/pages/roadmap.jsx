import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import './roadmap.css';

/* -------------------- Custom Nodes -------------------- */

const PhaseNode = ({ data }) => (
  <div className="phase-node">
    <Handle type="target" position={Position.Top} style={{opacity:0}} className="handle" />
    <div className="phase-content">
      <div className="phase-label">{data?.label}</div>
    </div>
    <Handle type="source" position={Position.Bottom} className="handle" />
  </div>
);

const TopicNode = ({ data }) => (
  <div className="topic-node">
    <Handle type="target" position={Position.Top} className="handle" />
    <div className="topic-content">{data?.label}</div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="handle"
      style={{ opacity: 0 }}
    />
  </div>
);

/* -------------------- Main Component -------------------- */

function Roadmap({ data: propData }) {
  const location = useLocation();
  const navigate = useNavigate();

  const roadmapData = Array.isArray(propData)
    ? propData
    : Array.isArray(location.state?.data)
      ? location.state.data
      : null;

  const nodeTypes = useMemo(
    () => ({
      phase: PhaseNode,
      topic: TopicNode,
    }),
    []
  );

  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    if (!roadmapData) return { nodes, edges };

    const PHASE_GAP = 300;
    const TOPIC_ROW_Y_OFFSET = 200;

    roadmapData.forEach((item, phaseIndex) => {
      const phaseId = `phase-${phaseIndex}`;
      const yPos = phaseIndex * PHASE_GAP;

      // Phase node
      nodes.push({
        id: phaseId,
        type: 'phase',
        position: { x: 0, y: yPos },
        data: { label: item?.Phase || `Phase ${phaseIndex + 1}` },
      });

      // Phase link
      if (phaseIndex > 0) {
        edges.push({
          id: `e-phase-${phaseIndex - 1}-${phaseIndex}`,
          source: `phase-${phaseIndex - 1}`,
          target: phaseId,
          type: 'smoothstep',
          animated: true,
        });
      }

      // Topics
      const topics = Array.isArray(item?.Topics) ? item.Topics : [];
      const spacing = 320;
      const startX = -((topics.length - 1) * spacing) / 2;

      topics.forEach((topic, topicIndex) => {
        const topicId = `${phaseId}-topic-${topicIndex}`;

        nodes.push({
          id: topicId,
          type: 'topic',
          position: {
            x: startX + topicIndex * spacing,
            y: yPos + TOPIC_ROW_Y_OFFSET,
          },
          data: { label: topic },
        });

        edges.push({
          id: `e-${phaseId}-${topicId}`,
          source: phaseId,
          target: topicId,
        });
      });
    });

    return { nodes, edges };
  }, [roadmapData]);

  if (!roadmapData) {
    return (
      <div className="roadmap-error">
        <h2>No roadmap data found 😔</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          Generate New Roadmap
        </button>
      </div>
    );
  }

  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <h1 className="roadmap-title">
          Your <span>Learning Path</span>
        </h1>
        <button onClick={() => navigate('/')} className="home-btn">
          New Prompt
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        className="roadmap-flow"
      >
        <Background gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Roadmap;
