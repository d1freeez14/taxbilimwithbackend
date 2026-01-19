import {PayStatus, PurchaseCourseRequest} from "@/types/sales";
import { Icon } from "@iconify/react/dist/iconify.js";
import {useEffect, useMemo, useState} from "react";
import {Course} from "@/types/course";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {SalesService} from "@/services/sales";
import {useSession} from "@/lib/useSession";

interface PaymentModalProps {
  isPayOpen: boolean;
  setIsPayOpen: (isOpen: boolean) => void;
  course: Course;
}
const PaymentModal = ({isPayOpen, setIsPayOpen, course}:PaymentModalProps) => {
  const { session, ready } = useSession();
  const queryClient = useQueryClient();
  const [payStatus, setPayStatus] = useState<PayStatus>("idle");
  const [payError, setPayError] = useState<string>("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  const closePay = () => {
    setIsPayOpen(false);
    setPayStatus("idle");
    setPayError("");
    setCardNumber("");
    setCardHolder("");
    setExp("");
    setCvc("");
  };
  const purchaseMutation = useMutation({
    mutationFn: (payload: PurchaseCourseRequest) => SalesService.purchaseCourse(session!.token, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["course", course.id, session?.token] });
      // optionally: await queryClient.invalidateQueries({ queryKey: ["enrollments", session?.token] });
      closePay();
    },
    onError: (e: any) => {
      setPayStatus("error");
      setPayError(e?.message ?? "Не удалось провести оплату");
    },
  });

  useEffect(() => {
    if (!isPayOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePay();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPayOpen]);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExp = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const isPayDisabled = useMemo(() => {
    const cardDigits = cardNumber.replace(/\s/g, "");
    const expOk = /^\d{2}\/\d{2}$/.test(exp);
    const cvcOk = /^\d{3,4}$/.test(cvc);
    return !(cardDigits.length === 16 && cardHolder.trim().length >= 3 && expOk && cvcOk);
  }, [cardNumber, cardHolder, exp, cvc]);

  const handlePay = async () => {
    setPayStatus("loading");
    setPayError("");

    const payload: PurchaseCourseRequest = {
      course_id: course.id,
      payment_method: "card",
      card_number: cardNumber.replace(/\s/g, ""),
      card_holder: cardHolder.trim(),
      expiry_date: exp,
      cvv: cvc,
    };

    purchaseMutation.mutate(payload);
  };
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        // закрываем только если клик по фону, а не по модалке
        if (e.target === e.currentTarget) closePay();
      }}
    >
      <div className="w-full max-w-[520px] rounded-[16px] bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-[20px] font-semibold text-black">Оплата курса</h3>
            <p className="text-[14px] text-[#676E76]">
              {course.title} • <span className="font-semibold text-black">{parseInt(course.price.toString(), 10)} ₸</span>
            </p>
          </div>

          <button
            onClick={closePay}
            className="rounded-[10px] p-2 hover:bg-[#F4F5F6]"
            aria-label="Закрыть"
          >
            <Icon icon="material-symbols:close" className="h-6 w-6 text-[#676E76]" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#383F45]">Номер карты</label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="h-11 w-full rounded-[10px] border border-[#E5E7EA] px-3 text-[14px] outline-none focus:border-[#EE7A67]"
              inputMode="numeric"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#383F45]">Имя на карте</label>
            <input
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="IVAN IVANOV"
              className="h-11 w-full rounded-[10px] border border-[#E5E7EA] px-3 text-[14px] outline-none focus:border-[#EE7A67]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#383F45]">Срок</label>
              <input
                value={exp}
                onChange={(e) => setExp(formatExp(e.target.value))}
                placeholder="MM/YY"
                className="h-11 w-full rounded-[10px] border border-[#E5E7EA] px-3 text-[14px] outline-none focus:border-[#EE7A67]"
                inputMode="numeric"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#383F45]">CVC</label>
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                className="h-11 w-full rounded-[10px] border border-[#E5E7EA] px-3 text-[14px] outline-none focus:border-[#EE7A67]"
                inputMode="numeric"
              />
            </div>
          </div>

          {payStatus === "error" && (
            <div className="rounded-[10px] bg-red-50 px-3 py-2 text-[13px] text-red-700">
              {payError}
            </div>
          )}

          {payStatus === "success" && (
            <div className="rounded-[10px] bg-green-50 px-3 py-2 text-[13px] text-green-700">
              Оплата успешна! Доступ к курсу открыт.
            </div>
          )}

          <div className="mt-2 flex gap-3">
            <button
              onClick={closePay}
              className="h-11 w-full rounded-[10px] border border-[#E5E7EA] text-[14px] font-semibold text-[#383F45] hover:bg-[#F4F5F6]"
              disabled={payStatus === "loading"}
            >
              Отмена
            </button>
            <button
              onClick={handlePay}
              disabled={isPayDisabled || payStatus === "loading" || payStatus === "success"}
              className="h-11 w-full rounded-[10px] bg-[#EE7A67] text-[14px] font-semibold text-white disabled:opacity-60"
            >
              {payStatus === "loading" ? "Оплата..." : "Оплатить"}
            </button>
          </div>

          <p className="mt-1 text-[12px] text-[#9EA5AD]">
            Это тестовая форма. Для реальной оплаты подключи платежный провайдер (Stripe / CloudPayments / Kaspi Pay и т.д.).
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
