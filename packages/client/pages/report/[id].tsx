import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Result {
  id: number;
  value: number;
  biomarker: {
    name: string;
    unit: string | null;
  };
}

interface Report {
  id: number;
  createdAt: string;
  results: Result[];
}

export default function ReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/api/report/${id}`)
        .then(res => res.json())
        .then(setReport);
    }
  }, [id]);

  if (!report) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">Report {report.id}</h1>
      <ul className="list-disc ml-4">
        {report.results.map(r => (
          <li key={r.id}>
            {r.biomarker.name}: {r.value}
            {r.biomarker.unit ? ` ${r.biomarker.unit}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
