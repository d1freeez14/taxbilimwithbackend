import Image from "next/image";
import {Icon} from "@iconify/react";
import {Certificate} from "@/types/certificate";
import {useEffect, useMemo, useState} from "react";

interface CertificateCardProps {
  certificate: Certificate;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // RU-style dd.mm.yyyy
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

const CertificateCard = ({certificate}: CertificateCardProps) => {
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  return (
    <>
      <div className={'flex flex-col p-5 rounded-[1rem] gap-6 items-center w-full bg-white min-w-[350px]'}>
        <div className="relative w-full aspect-video rounded-[0.5rem] overflow-hidden">
          <Image
            src="/certificateCard.png" alt="" fill className={"object-cover"}/>
        </div>
        <div className={'flex flex-col gap-3 w-full'}>
          <div className={'flex items-center justify-between gap-2'}>
            <div className={'flex items-center gap-3'}>
              <Image src={'/avatars.png'} alt={''} width={32} height={32} className={'rounded-full'}/>
              <p className={'text-[1rem] text-black font-medium'}>{certificate.author_name}</p>
            </div>
            <div className={'flex items-center gap-1 bg-[#F6F7F9] px-2 py-1 rounded-[1rem]'}>
              <Icon icon={'heroicons:document-check-solid'} className={'text-black w-[18px] h-[18px]'}/>
              {/*<p className={'text-black text-[12px] font-medium'}>{certificate.category}</p>*/}
            </div>
          </div>
          <h2 className={'text-black text-[20px] font-semibold'}>
            {certificate.course_title}
          </h2>
          <p className={'text-[14px] text-[#676E76] font-medium'}>
            Дата получения:
            <span className={'text-black font-semibold'}> {formatDate(certificate.issued_at)}</span>
          </p>
        </div>
        <button
          onClick={() => setIsCertificateModalOpen(true)}
          className={'text-black px-5 py-3 w-full rounded-[0.5rem] text-[14px] font-semibold shadow border border-[#9EA5AD]'}>
          Посмотреть
        </button>
      </div>
      {isCertificateModalOpen && (
        <CertificateModal certificate={certificate} isOpen={isCertificateModalOpen}
                          onClose={() => setIsCertificateModalOpen(false)}/>
      )}
    </>
  );
};

interface CertificateModalProps {
  certificate: Certificate;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateModal = ({certificate, isOpen, onClose}: CertificateModalProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const endDate = useMemo(() => formatDate(certificate?.issued_at), [certificate?.issued_at]);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(certificate.certificate_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = certificate.certificate_url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    // If your URL already triggers download - great.
    // Otherwise, open in new tab and let user save.
    window.open(certificate.certificate_url, "_blank", "noopener,noreferrer");
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-9 shadow-xl max-h-[90vh] overflow-auto flex flex-col gap-6">
        {/*HEADER*/}
        <header onClick={onClose} className={'flex flex-col w-full justify-center items-center'}>
          <button className="self-end text-[#EE7A67] text-xl">✕</button>
          <h1 className={'text-black text-2xl font-semibold'}>Просмотр сертификата</h1>
        </header>
        {/*MAIN*/}
        <div className="rounded-2xl bg-[#141516] p-6 sm:p-8 relative overflow-hidden">
          <Image
            src="/certificateBg.png" // <-- your image in /public
            alt=""
            aria-hidden="true"
            width={260}
            height={260}
            className="pointer-events-none select-none absolute right-[-80px] top-[150px] -translate-y-[55%] opacity-10"
            priority
          />
          <div className="flex items-center gap-3">
            <Image src={'/taxBilim.png'} alt={''} width={150} height={30}/>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              {/*<span className="text-[#EE7A67]">Сертифицированный</span>{" "}*/}
              <span className="text-white">
                {certificate.course_title}
              </span>
            </h2>

            <div className="mt-5">
              <span className="inline-flex items-center rounded-lg border border-white/25 px-4 py-2 text-xs font-semibold tracking-wide text-white">
                ПОВЫШЕНИЕ КВАЛИФИКАЦИИ
              </span>
            </div>

            <p className="mt-4 max-w-3xl text-white/70 text-sm leading-relaxed">
              {certificate.course_description ||
                "Описание курса будет отображаться здесь. Убедись, что оно не слишком длинное — иначе можно ограничить по строкам."}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-[240px]">
              <div className="text-white/60 text-xs mb-2">ФИО лектора</div>
              <div className="border-b border-white/25 pb-2 text-white/80 text-sm">
                {certificate.author_name || "—"}
              </div>
            </div>

            <div className="min-w-[240px]">
              <div className="text-white/60 text-xs mb-2">Дата окончания</div>
              <div className="border-b border-white/25 pb-2 text-white/80 text-sm">
                {endDate || "—"}
              </div>
            </div>
          </div>
          <div className="mt-6 text-white/60 text-sm italic">Powered by TaxBilim</div>
        </div>

        {/*FOOTER*/}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handleCopy}
            className="h-12 rounded-xl border border-black/10 bg-white px-5 font-medium text-black hover:bg-black/5"
            type="button"
          >
            {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
          </button>

          <button
            onClick={handleDownload}
            className="h-12 rounded-xl bg-[#EE7A67] px-6 font-semibold text-white hover:opacity-95"
            type="button"
          >
            Скачать .pdf
          </button>
        </div>
      </div>
    </div>
  )
}
export default CertificateCard;
