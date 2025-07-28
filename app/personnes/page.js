// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { apiFetch, getPhotoUrl } from "../components/FetchAPI";
// import Image from "next/image";
// import { useRouter } from 'next/navigation';
// import { useUserRole } from "../hooks/useUserRole";

// function formatDateFR(dateStr) {
//   if (!dateStr) return '';
//   const date = new Date(dateStr);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }

// export default function PersonnesList() {
//   const [personnes, setPersonnes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const router = useRouter();

//   const role = useUserRole();
//   const isAdmin = role === 'admin';

//   useEffect(() => {
//     apiFetch('/personnes')
//       .then((res) => res.json())
//       .then((data) => {
//         setPersonnes(data);
//         setLoading(false);
//       });
//   }, []);

//   // Filtrer les personnes en fonction du terme de recherche
//   const filteredPersonnes = personnes.filter(personne =>
//     `${personne.first_name} ${personne.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     personne.birth_place?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Fonction de tri
//   const sortedPersonnes = (() => {
//     if (!sortConfig.key) return filteredPersonnes;

//     const sorted = [...filteredPersonnes].sort((a, b) => {
//       let aVal, bVal;

//       switch (sortConfig.key) {
//         case 'last_name':
//           aVal = a.last_name || '';
//           bVal = b.last_name || '';
//           break;
//         case 'first_name':
//           aVal = a.first_name || '';
//           bVal = b.first_name || '';
//           break;
//         case 'gender':
//           aVal = a.gender || '';
//           bVal = b.gender || '';
//           break;
//         case 'birth_date':
//           aVal = a.birth_date ? new Date(a.birth_date) : new Date(0);
//           bVal = b.birth_date ? new Date(b.birth_date) : new Date(0);
//           break;
//         case 'birth_place':
//           aVal = a.birth_place || '';
//           bVal = b.birth_place || '';
//           break;
//         case 'father':
//           aVal = a.father ? `${a.father.last_name} ${a.father.first_name}` : '';
//           bVal = b.father ? `${b.father.last_name} ${b.father.first_name}` : '';
//           break;
//         case 'mother':
//           aVal = a.mother ? `${a.mother.last_name} ${a.mother.first_name}` : '';
//           bVal = b.mother ? `${b.mother.last_name} ${b.mother.first_name}` : '';
//           break;
//         case 'conjoint':
//           aVal = a.conjoint ? `${a.conjoint.last_name} ${a.conjoint.first_name}` : '';
//           bVal = b.conjoint ? `${b.conjoint.last_name} ${b.conjoint.first_name}` : '';
//           break;
//         default:
//           aVal = '';
//           bVal = '';
//       }

//       // Comparaison selon le type de donnée
//       if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
//       return 0;
//     });

//     return sorted;
//   })();

//   // Handler pour changer le tri sur clic d'en-tête
//   function handleSort(key) {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   }

//   // Affiche une flèche selon le sens du tri sur la colonne
//   function getSortIndicator(key) {
//     if (sortConfig.key !== key) return null;
//     return sortConfig.direction === 'asc' ? '▲' : '▼';
//   }

//   if (loading) return <div className="text-center text-cyan-400 mt-10 text-xl">Chargement...</div>;

//   return (
//     <div className="container py-8 mx-auto">
//       <h1 className="text-3xl font-bold text-cyan-300 mb-6">Liste des personnes</h1>
      
//       {/* Barre de recherche avec bouton d'ajout */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
//           <label htmlFor="search" className="text-cyan-100 font-medium whitespace-nowrap">
//             Rechercher :
//           </label>
//           <input
//             id="search"
//             type="text"
//             placeholder="Nom, prénom, lieu..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 w-full sm:w-auto"
//           />
//           {isAdmin && (
//             <Link
//               href="/personnes/new"
//               className=" font-bold py-2 px-6 rounded-md shadow hover:scale-105 transition w-full sm:w-auto text-center"
//             >
//               + Ajouter une personne
//             </Link>
//           )}
//         </div>
//       </div>
//       <div className="overflow-x-auto rounded-2xl shadow-lg">
//         <table className="min-w-full table-auto bg-gray-900 text-white">
//           <thead>
//             <tr className="bg-cyan-900 text-cyan-200">
//               <th className="p-3 text-center">Photo</th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('last_name')}
//               >
//                 Nom {getSortIndicator('last_name')}
//               </th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('first_name')}
//               >
//                 Prénom {getSortIndicator('first_name')}
//               </th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('gender')}
//               >
//                 Genre {getSortIndicator('gender')}
//               </th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('birth_date')}
//               >
//                 Date de naissance {getSortIndicator('birth_date')}
//               </th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('birth_place')}
//               >
//                 Lieu de naissance {getSortIndicator('birth_place')}
//               </th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('father')}
//               >
//                 Père {getSortIndicator('father')}
//               </th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('mother')}
//               >
//                 Mère {getSortIndicator('mother')}
//               </th>

//               <th
//                 className="p-3 text-center cursor-pointer select-none"
//                 onClick={() => handleSort('conjoint')}
//               >
//                 Conjoint {getSortIndicator('conjoint')}
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedPersonnes.length > 0 ? sortedPersonnes.map(
//               (personne, index) => (
//                 <tr
//                   key={personne.id}
//                   onClick={() => router.push(`/personnes/${personne.id}/index`)}
//                   className={`border-b border-gray-800 hover:bg-gray-800 transition cursor-pointer ${
//         index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
//       }`}
//                 >
//                   <td className="p-2 text-center">
//                     <Image
//                       src={getPhotoUrl(personne.photo)}
//                       alt="Photo"
//                       width={48}
//                       height={48}
//                       style={{ width: 48, height: 48, objectFit: 'cover' }}
//                       className="rounded-full mx-auto object-cover"
//                     />
//                   </td>
//                   <td className="p-2 text-center whitespace-nowrap">{personne.last_name}</td>
//                   <td className="p-2 text-center whitespace-nowrap">{personne.first_name}</td>
//                   <td className="p-2 text-center">{personne.gender || ''}</td>
//                   <td className="p-2 text-center">{formatDateFR(personne.birth_date)}</td>
//                   <td className="p-2 text-center whitespace-nowrap">{personne.birth_place || ''}</td>
//                   <td className="p-2 text-center whitespace-nowrap">{personne.father ? `${personne.father.first_name}` : ''}</td>
//                   <td className="p-2 text-center whitespace-nowrap">{personne.mother ? `${personne.mother.last_name} ${personne.mother.first_name}` : ''}</td>
//                   <td className="p-2 text-center whitespace-nowrap">{personne.conjoint ? `${personne.conjoint.last_name} ${personne.conjoint.first_name}` : ''}</td>
//                 </tr>
//               )
//             ) : (
//               <tr>
//                 <td colSpan={10} className="text-center text-gray-400 py-6">
//                   {searchTerm ? `Aucune personne trouvée pour "${searchTerm}"` : 'Aucune personne trouvée.'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Affichage du nombre de résultats */}
//       {searchTerm && (
//         <div className="mt-4 text-center text-cyan-300">
//           {sortedPersonnes.length} personne{sortedPersonnes.length > 1 ? 's' : ''} trouvée{sortedPersonnes.length > 1 ? 's' : ''}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../components/FetchAPI";
import PersonCard from "../components/PersonCard";
import { useUserRole } from "../hooks/useUserRole";

export default function PersonnesList() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const role = useUserRole();
  const isAdmin = role === "admin";

  useEffect(() => {
    apiFetch("/personnes")
      .then((res) => res.json())
      .then((data) => {
        setPersonnes(data);
        setLoading(false);
      });
  }, []);

  const sortOptions = [
  { key: "last_name", label: "Nom" },
  { key: "first_name", label: "Prénom" },
  { key: "gender", label: "Genre" },
  { key: "birth_date", label: "Année" },
];

  // Recherche
  const filtered = personnes.filter((p) =>
    `${p.first_name} ${p.last_name} ${p.birth_place}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Tri
  const sorted = [...filtered].sort((a, b) => {
    const key = sortConfig.key;
    if (!key) return 0;

    let aVal = a[key] || "";
    let bVal = b[key] || "";

    if (key === "birth_date") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

const handleSort = (key) => {
  const direction =
    sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
  setSortConfig({ key, direction });
};


  if (loading)
    return (
      <div className="text-center text-cyan-400 mt-10 text-xl">Chargement...</div>
    );

  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-3xl font-bold text-cyan-300 mb-6">Liste des personnes</h1>

      {/* Barre de recherche et bouton */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <label
            htmlFor="search"
            className="text-cyan-100 font-medium whitespace-nowrap"
          >
            Rechercher :
          </label>
          <input
            id="search"
            type="text"
            placeholder="Nom, prénom, lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 w-full sm:w-auto"
          />
          {isAdmin && (
            <Link
              href="/personnes/new"
              className="font-bold py-2 px-6 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white shadow w-full sm:w-auto text-center"
            >
              + Ajouter une personne
            </Link>
          )}
        </div>
      </div>

      {/* Tri */}
      <div className="flex flex-wrap items-center ps-4 gap-2 mb-4 text-sm">
        <span className="text-gray-400">Trier par :</span>
        {sortOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`px-3 py-1 rounded-full text-white ${
              sortConfig.key === key
                ? "bg-cyan-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {label}{" "}
            {sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
          </button>
        ))}
      </div>
      {/* Affichage cartes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.length > 0 ? (
          sorted.map((personne) => (
            <PersonCard key={personne.id} personne={personne} />
          ))
        ) : (
          <div className="text-center text-gray-400 col-span-full">
            {searchTerm
              ? `Aucune personne trouvée pour "${searchTerm}"`
              : "Aucune personne trouvée."}
          </div>
        )}
      </div>

      {/* Résultat count */}
      {searchTerm && (
        <div className="mt-4 text-center text-cyan-300">
          {sorted.length} personne{sorted.length > 1 ? "s" : ""} trouvée
          {sorted.length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
