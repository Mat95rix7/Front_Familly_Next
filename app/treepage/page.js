"use client";

import React, { useState, useEffect } from "react";
import Tree from "react-family-tree";
import { apiFetch } from "../components/FetchAPI"; 

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR");
}

function getAge(dateStr) {
  if (!dateStr) return '';
  const birth = new Date(dateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function FamilyTreePage() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rootId, setRootId] = useState(1);


  useEffect(() => {
    apiFetch('/personnes')
      .then((res) => res.json())
      .then((data) => {
        setPersonnes(data);
        setLoading(false);
      });
  }, []);

  console.log(personnes);

  // if (!Array.isArray(nodes) || nodes.length === 0) {
  // return <div className="text-center mt-10 text-cyan-400">Chargement...</div>;
// }

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "auto", padding: 20 }}>
      <Tree
        nodes={nodes}
        rootId={rootId}
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        renderNode={(node) => (
          <div
            key={node.id}
            style={{
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              backgroundColor: "#1e293b",
              color: "white",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              boxShadow: "0 0 8px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}
            onClick={() => setRootId(node.id)}
          >
            <div className="font-bold">{node.last_name} {node.first_name}</div>
            <div className="text-sm mt-1">{formatDate(node.birthDate)}</div>
            <div className="text-sm text-cyan-300">{getAge(node.birthDate)} ans</div>
          </div>
        )}
      />
    </div>
  );
}
