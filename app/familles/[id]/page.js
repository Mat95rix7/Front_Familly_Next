"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, getPhotoUrl } from "../../components/FetchAPI";
import Image from "next/image";

function formatDateFR(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FamilyMember({ role, personne, link }) {
  const hasData = !!personne;
  const altText = hasData
    ? `Photo de ${personne.first_name}`
    : `Photo par défaut pour ${role}`;

  const firstName = hasData ? personne.first_name : "Non renseigné";
  const age = hasData ? `${personne.age ?? ""} ans` : "";
  const birth = hasData ? formatDateFR(personne.birth_date) : "";

  return (
    <div className="flex flex-col items-center min-w-[75px] md:min-w-[110px] mx-1">
      <div className="text-cyan-400 text-sm mb-1 text-center">{role}</div>

      {hasData ? (
        <Link href={link} className="family-link group">
          <Image
            src={getPhotoUrl(personne.photo)}
            alt={altText}
            width={80}
            height={80}
            style={{ width: 80, height: 80, objectFit: "cover" }}
            className="object-cover mx-auto rounded-full border-4 border-cyan-400 mb-3 shadow-md"
          />
        </Link>
      ) : (
        <Image
          src={getPhotoUrl("default.png")}
          alt={altText}
          width={80}
          height={80}
          className="object-cover mx-auto rounded-full border-4 border-cyan-400 mb-3 shadow-md bg-gray-800"
        />
      )}

      <div
        className={`font-bold mt-2 family-label text-center ${
          hasData ? "group-hover:text-purple-500 transition" : "text-gray-400"
        }`}
      >
        {firstName}
      </div>

      <div className="text-xs text-white bg-amber-600 px-2 py-1 mt-1 rounded font-semibold">
        {age || "Âge inconnu"}
      </div>

      <div className="text-xs text-gray-400 mt-1">
        {birth || "Date inconnue"}
      </div>
    </div>
  );
}

export default function FamillePage() {
  const { id } = useParams();
  const [famille, setFamille] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiFetch(`/familles/${id}/`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || data.error) {
          setNotFound(true);
        } else {
          setFamille(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données de la famille :", error);
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="text-center text-cyan-400 mt-10 text-xl">Chargement...</div>;
  if (notFound || !famille)
    return <div className="text-center text-red-400 mt-10 text-xl">Famille non trouvée</div>;

  const {
    pere,
    mere,
    enfants = [],
    grand_pere_paternel,
    grand_mere_paternelle,
    grand_pere_maternel,
    grand_mere_maternelle,
    is_mari,
  } = famille;

  return (
    <div className="container py-8 mx-auto">
      <h2 className="text-2xl font-bold text-cyan-300 mb-8 text-center">
        Famille de {pere?.first_name} {pere?.last_name}
      </h2>

      {is_mari ? (
        <div className="family-tree flex flex-col items-center">
          <div className="flex flex-nowrap justify-center gap-2 md:gap-10 mb-4 family-row w-full md:max-w-none px-4 overflow-x-auto custom-scrollbar">
            <FamilyMember role="Grand-père paternel" personne={grand_pere_paternel} link={grand_pere_paternel ? `/personnes/${grand_pere_paternel.id}` : "#"} />
            <FamilyMember role="Grand-mère paternelle" personne={grand_mere_paternelle} link={grand_mere_paternelle ? `/personnes/${grand_mere_paternelle.id}` : "#"} />
            <FamilyMember role="Grand-père maternel" personne={grand_pere_maternel} link={grand_pere_maternel ? `/personnes/${grand_pere_maternel.id}` : "#"} />
            <FamilyMember role="Grand-mère maternelle" personne={grand_mere_maternelle} link={grand_mere_maternelle ? `/personnes/${grand_mere_maternelle.id}` : "#"} />
          </div>

          <svg className="w-full h-[30px]" viewBox="0 0 600 30" preserveAspectRatio="xMidYMid meet">
            <line x1="75" y1="0" x2="180" y2="30" stroke="#0dcaf0" strokeWidth="2" className="hidden md:block" />
            <line x1="190" y1="0" x2="180" y2="30" stroke="#0dcaf0" strokeWidth="2" className="hidden md:block" />
            <line x1="410" y1="0" x2="420" y2="30" stroke="#0dcaf0" strokeWidth="2" className="hidden md:block" />
            <line x1="500" y1="0" x2="420" y2="30" stroke="#0dcaf0" strokeWidth="2" className="hidden md:block" />
          </svg>

          <svg className="w-full h-[40px] md:hidden" viewBox="0 0 100 30" preserveAspectRatio="none">
            <line x1="25" y1="0" x2="35" y2="25" stroke="#0dcaf0" strokeWidth="1" />
            <line x1="40" y1="0" x2="35" y2="25" stroke="#0dcaf0" strokeWidth="1" />
            <line x1="60" y1="0" x2="65" y2="25" stroke="#0dcaf0" strokeWidth="1" />
            <line x1="75" y1="0" x2="65" y2="25" stroke="#0dcaf0" strokeWidth="1" />
          </svg>

          <div className="flex justify-center gap-10 mb-4 family-row w-full max-w-md md:max-w-none px-4">
            <FamilyMember role="Père" personne={pere} link={pere ? `/personnes/${pere.id}` : "#"} />
            <FamilyMember role="Mère" personne={mere} link={mere ? `/personnes/${mere.id}` : "#"} />
          </div>

          <svg className="w-full h-[30px]" viewBox="0 0 300 30" preserveAspectRatio="xMidYMid meet">
            <line x1="100" y1="0" x2="100" y2="30" stroke="#0dcaf0" strokeWidth="2" className="hidden md:block" />
            <line x1="200" y1="0" x2="200" y2="30" stroke="#0dcaf0" strokeWidth="2" className="hidden md:block" />
            <line x1="100" y1="30" x2="200" y2="30" stroke="#0dcaf0" strokeWidth="2" className="hidden md:block" />

            <line x1="85" y1="0" x2="85" y2="30" stroke="#0dcaf0" strokeWidth="2" className="md:hidden" />
            <line x1="210" y1="0" x2="210" y2="30" stroke="#0dcaf0" strokeWidth="2" className="md:hidden" />
            <line x1="85" y1="30" x2="210" y2="30" stroke="#0dcaf0" strokeWidth="2" className="md:hidden" />
          </svg>
          <div className="flex justify-center gap-6 mt-3 family-children flex-wrap px-4">
            {enfants && enfants.length > 0 ? (
              enfants.map((enfant) => (
                <FamilyMember key={enfant.id} role="Enfant" personne={enfant} link={`/personnes/${enfant.id}`} />
              ))
            ) : (
              <div className="font-bold text-gray-400 family-label">Aucun enfant trouvé.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 text-yellow-800 rounded p-4 text-center max-w-lg mx-auto mb-6">
          Cette personne n&#39;est pas référencée comme marié. Elle ne peut donc pas avoir une famille.
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Link
          href="/familles"
          className="bg-gray-700 text-white font-bold py-2 px-5 rounded shadow-md flex items-center gap-2 hover:scale-105 transition"
        >
          Retour à la liste
        </Link>
      </div>

      <style jsx>{`
        .family-tree {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .family-row {
          justify-content: center;
          align-items: flex-end;
          margin-bottom: 16px;
        }
        .family-label {
          font-weight: bold;
          margin-top: 6px;
          font-size: 1.1em;
        }
        .family-children {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0dcaf0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00b0d9;
        }
      `}</style>
    </div>
  );
}