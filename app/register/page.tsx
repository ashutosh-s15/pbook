import { SiteHeader } from '@/components/site-header';
import RegisterPatient from '@/containers/register-patient';

export default function Page() {
  return (
    <>
      <SiteHeader title="Register Patient" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <RegisterPatient />
          </div>
        </div>
      </div>
    </>
  );
}
