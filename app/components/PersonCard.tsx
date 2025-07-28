// components/PersonCard.tsx
import Image from "next/image";
import Link from "next/link";
import { getPhotoUrl } from "../components/FetchAPI";

export default function PersonCard({ personne }) {
  const birthYear = personne.birth_date
    ? new Date(personne.birth_date).getFullYear()
    : "Né(e) ?";

  return (
    <Link href={`/personnes/${personne.id}`} className="block">
      <div className="bg-gray-800 rounded-xl p-4 shadow hover:shadow-lg hover:scale-[1.02] transition cursor-pointer flex items-center gap-4">
        <Image
          src={getPhotoUrl(personne.photo)}
          alt={personne.first_name}
          width={56}
          height={56}
          className="rounded-full object-cover border-2 border-cyan-500"
        />
        <div className="flex-1">
          <h3 className="text-cyan-200 font-bold text-lg">
            {personne.first_name} {personne.last_name}
          </h3>
          <p>Père : <span className="text-gray-400">{personne.father ? personne.father.first_name : "Inconnu"}</span></p>
          <p className="text-sm text-gray-400">
            {personne.gender || "Genre ?"} – {personne.birth_place || "Lieu ?"}
          </p>
        </div>
        <div className="text-md bg-amber-600 text-gray-200 px-2 py-1 rounded-full">
          {birthYear}
        </div>
      </div>
    </Link>
  );
}
