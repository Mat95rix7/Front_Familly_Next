"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, getPhotoUrl } from "../../components/FetchAPI";
import Image from "next/image";

function formatDateFR(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function FamilyMember({ role, personne, link }) {
  return (
    <div className="flex flex-col items-center min-w-[110px]">
      <div className="text-cyan-400 text-sm mb-1">{role}</div>
      {personne ? (
        <Link href={link} className="family-link group">
          <Image
            src={getPhotoUrl(personne.photo)}
            alt="Photo"
            width={90}
            height={90}
            style={{ width: 90, height: 90, objectFit: 'cover' }} 
            className="object-cover mx-auto rounded-full border-4 border-cyan-400 mb-3 shadow-md"
          />
          <div className="font-bold mt-2 family-label group-hover:text-purple-500 transition">
            {personne.first_name} <span className="inline-block bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded ml-1 align-middle">{personne.age ? `${personne.age} ans` : ''}</span>
            <div className="text-xs text-gray-400 mt-1 text-center">{formatDateFR(personne.birth_date)}</div>
          </div>
        </Link>
      ) : (
        <>
          <Image
            src={getPhotoUrl('default.png')}
            alt="Photo"
            width={100}
            height={70}
            className="object-cover border-4 border-cyan-400 shadow-md bg-gray-800 rounded-full"
          />
          <div className="font-bold mt-2 text-gray-400 family-label">Non renseigné{role.endsWith('e') ? 'e' : ''}</div>
        </>
      )}
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
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        console.log('Famille data:', data);
        if (!data || data.error) {
          setNotFound(true);
        } else {
          setFamille(data);
        }
        setLoading(false);
      });
  }, [id]);


  if (loading) return <div className="text-center text-cyan-400 mt-10 text-xl">Chargement...</div>;
  if (notFound || !famille) return <div className="text-center text-red-400 mt-10 text-xl">Famille non trouvée</div>;

  const {
    pere,
    mere,
    enfants = [],
    grand_pere_paternel,
    grand_mere_paternelle,
    grand_pere_maternel,
    grand_mere_maternelle,
    is_mari
  } = famille;

  return (
    <div className="container py-8 mx-auto">
      <h2 className="text-2xl font-bold text-cyan-300 mb-8 text-center">Famille de {pere?.first_name} {pere?.last_name}</h2>
      {famille.is_mari ? (
        <div className="flex flex-col items-center family-tree">
          {/* Grands-parents */}
          <div className="flex justify-center items-end gap-10 mb-4 family-row">
            <FamilyMember role="Grand-père paternel" personne={famille.grand_pere_paternel} link={famille.grand_pere_paternel ? `/personnes/${famille.grand_pere_paternel.id}` : "#"} />
            <FamilyMember role="Grand-mère paternelle" personne={famille.grand_mere_paternelle} link={famille.grand_mere_paternelle ? `/personnes/${famille.grand_mere_paternelle.id}` : "#"} />
            <div className="w-[40px] md:w-[60px]"></div>
            <FamilyMember role="Grand-père maternel" personne={famille.grand_pere_maternel} link={famille.grand_pere_maternel ? `/personnes/${famille.grand_pere_maternel.id}` : "#"} />
            <FamilyMember role="Grand-mère maternelle" personne={famille.grand_mere_maternelle} link={famille.grand_mere_maternelle ? `/personnes/${famille.grand_mere_maternelle.id}` : "#"} />
          </div>
          {/* Traits SVG pour relier grands-parents et parents */}
          <svg className="w-full h-[30px] family-svg" viewBox="0 0 600 30">
            <line x1="80" y1="0" x2="220" y2="30" stroke="#0dcaf0" strokeWidth="2" />
            <line x1="200" y1="0" x2="220" y2="30" stroke="#0dcaf0" strokeWidth="2" />
            <line x1="400" y1="0" x2="380" y2="30" stroke="#0dcaf0" strokeWidth="2" />
            <line x1="520" y1="0" x2="380" y2="30" stroke="#0dcaf0" strokeWidth="2" />
          </svg>
          {/* Parents */}
          <div className="flex justify-center items-end gap-10 mb-4 family-row">
            <FamilyMember role="Père" personne={famille.pere} link={`/personnes/${famille.pere?.id}`} />
            <FamilyMember role="Mère" personne={famille.mere} link={famille.mere ? `/personnes/${famille.mere.id}` : "#"} />
          </div>
          {/* Trait SVG pour relier parents et enfants */}
          <svg className="w-full h-[30px] family-svg" viewBox="0 0 300 30">
            <line x1="80" y1="0" x2="80" y2="30" stroke="#0dcaf0" strokeWidth="2" />
            <line x1="220" y1="0" x2="220" y2="30" stroke="#0dcaf0" strokeWidth="2" />
            <line x1="80" y1="30" x2="220" y2="30" stroke="#0dcaf0" strokeWidth="2" />
          </svg>
          {/* Enfants */}
          <div className="flex justify-center gap-6 mt-3 family-children">
            {famille.enfants && famille.enfants.length > 0 ? famille.enfants.map((enfant) => (
              <FamilyMember key={enfant.id} role="Enfant" personne={enfant} link={`/personnes/${enfant.id}`} />
            )) : (
              <div className="font-bold text-gray-400 family-label">Aucun enfant trouvé.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 text-yellow-800 rounded p-4 text-center max-w-lg mx-auto mb-6">Cette personne n&#39;est pas référencée comme marié. Elle ne peut donc pas avoir une famille.</div>
      )}
      <div className="flex justify-center mt-8">
        <Link href="/personnes" className="bg-gray-700 text-white font-bold py-2 px-5 rounded shadow-md flex items-center gap-2 hover:scale-105 transition">Retour à la liste</Link>
      </div>
      <style jsx>{`
        .family-tree { display: flex; flex-direction: column; align-items: center; }
        .family-row { display: flex; justify-content: center; align-items: flex-end; gap: 40px; margin-bottom: 16px; }
        .family-label { font-weight: bold; margin-top: 6px; font-size: 1.1em; }
        .family-children { display: flex; justify-content: center; gap: 24px; margin-top: 12px; }
        .family-svg { width: 100%; height: 30px; display: block; }
      `}</style>
    </div>
  );
} 