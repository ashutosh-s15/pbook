import { SiteHeader } from '@/components/site-header';
import PatientList from '@/containers/patient-list';

export default function Page() {
  return (
    <>
      <SiteHeader title="Patients" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PatientList />
          </div>
        </div>
      </div>
    </>
  );
}
