"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Tree = dynamic(() => import("react-d3-tree").then(mod => mod.Tree), { ssr: false });

export default function FamilyTree({ data }) {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    if (data) {
      setTreeData([transformToTree(data)]);
    }
  }, [data]);

  const transformToTree = (person) => {
    return {
      name: `${person.first_name} ${person.last_name}`,
      attributes: {
        id: person.id,
        gender: person.gender,
        birth: person.birth_date,
      },
      children: person.children?.map(transformToTree) || [],
    };
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      {treeData.length > 0 && (
        <Tree data={treeData} orientation="vertical" translate={{ x: 300, y: 50 }} />
      )}
    </div>
  );
}
