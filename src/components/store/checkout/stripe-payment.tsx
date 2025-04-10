"use client";

import { clearCartCookieAction } from "@/actions/cart-actions";
import { processCheckoutAction } from "@/actions/checkout-actions";
import { useTranslations } from "@/i18n/client";
// import { saveBillingAddressAction, saveShippingRateAction } from "@/ui/checkout/checkout-actions";
// import { type AddressSchema, getAddressSchema } from "@/ui/checkout/checkout-form-schema";
// import { ShippingRatesSection } from "@/ui/checkout/shipping-rates-section";
// import { saveTaxIdAction } from "@/ui/checkout/tax-action";
// import { CountrySelect } from "@/ui/country-select";
// import { useDidUpdate } from "@/ui/hooks/lifecycle";
// import { InputWithErrors } from "@/ui/input-errors";
// import {
// 	AddressElement,
// 	LinkAuthenticationElement,
// 	PaymentElement,
// 	useElements,
// 	useStripe,
// } from "@stripe/react-stripe-js";
// import type * as Commerce from "commerce-kit";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEventHandler, useRef, useState, useTransition } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedValue } from "@/lib/hooks";

import { CountrySelect } from "../country-select";
import { useDidUpdate } from "../hooks/lifecycle";
import { InputWithErrors } from "../input-errors";
import { saveBillingAddressAction, saveShippingRateAction } from "./checkout-actions";
import { type AddressSchema, getAddressSchema } from "./checkout-form-schema";
import { type ShippingRate, ShippingRatesSection } from "./shipping-rates-section";
import { saveTaxIdAction } from "./tax-action";

export const StripePayment = ({
	shippingRateId,
	shippingRates,
	allProductsDigital,
	locale,
}: {
	shippingRateId?: string | null;
	shippingRates: ShippingRate[];
	allProductsDigital: boolean;
	locale: string;
}) => {
	return (
		<PaymentForm
			locale={locale}
			shippingRates={shippingRates}
			cartShippingRateId={shippingRateId ?? null}
			allProductsDigital={allProductsDigital}
		/>
	);
};

const PaymentForm = ({
	shippingRates,
	cartShippingRateId,
	allProductsDigital,
	locale,
}: {
	shippingRates: ShippingRate[];
	cartShippingRateId: string | null;
	allProductsDigital: boolean;
	locale: string;
}) => {
	const t = useTranslations("/cart.page.stripePayment");
	const ft = useTranslations("/cart.page.formErrors");
	const user = useSession().data?.user;
	const addressSchema = getAddressSchema({
		cityRequired: ft("cityRequired"),
		countryRequired: ft("countryRequired"),
		line1Required: ft("line1Required"),
		nameRequired: ft("nameRequired"),
		postalCodeRequired: ft("postalCodeRequired"),
	});

	const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof AddressSchema, string[] | null | undefined>>
	>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isTransitioning, transition] = useTransition();
	const [billingAddressValues, setBillingAddressValues] = useState<AddressSchema>({
		name: "",
		city: "",
		country: "",
		line1: "",
		line2: "",
		postalCode: "",
		state: "",
		phone: "",
		taxId: "",
		email: "",
	});

	const [isBillingAddressPending, debouncedBillingAddress] = useDebouncedValue(billingAddressValues, 1000);
	const [shippingRateId, setShippingRateId] = useState<string | null>(cartShippingRateId);

	const [sameAsShipping, setSameAsShipping] = useState(true);
	const [email, setEmail] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [expiryDate, setExpiryDate] = useState("");
	const [cvc, setCvc] = useState("");

	const router = useRouter();

	useDidUpdate(() => {
		transition(async () => {
			await saveBillingAddressAction({
				billingAddress: debouncedBillingAddress,
			});
			router.refresh();
		});
	}, [debouncedBillingAddress, router]);

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		try {
			const result = await processCheckoutAction({
				email,
				cardNumber: cardNumber.replace(/\s/g, ""),
				expiry: expiryDate,
				cvc,
			});

			// Clear cart and redirect to success page
			await clearCartCookieAction();
			router.push(`/order/success?order_id=${result.orderId}`);
		} catch (error) {
			setIsLoading(false);
			setFormErrorMessage(error instanceof Error ? error.message : t("unexpectedError"));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4">
			<div className="grid gap-4">
				<InputWithErrors
					label="Email"
					name="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="email"
					errors={{}}
				/>

				<InputWithErrors
					label="Card Number"
					name="cardNumber"
					type="text"
					value={cardNumber}
					onChange={(e) => {
						const value = e.target.value.replace(/\D/g, "");
						const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
						setCardNumber(formatted);
					}}
					required
					maxLength={19}
					placeholder="1234 5678 9012 3456"
					autoComplete="cc-number"
					errors={{}}
				/>

				<div className="grid grid-cols-2 gap-4">
					<InputWithErrors
						label="Expiry Date"
						name="expiryDate"
						type="text"
						value={expiryDate}
						onChange={(e) => {
							const value = e.target.value.replace(/\D/g, "");
							if (value.length <= 2) {
								setExpiryDate(value);
							} else {
								setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
							}
						}}
						required
						maxLength={5}
						placeholder="MM/YY"
						autoComplete="cc-exp"
						errors={{}}
					/>

					<InputWithErrors
						label="CVC"
						name="cvc"
						type="text"
						value={cvc}
						onChange={(e) => {
							const value = e.target.value.replace(/\D/g, "");
							setCvc(value);
						}}
						required
						maxLength={4}
						placeholder="123"
						autoComplete="cc-csc"
						errors={{}}
					/>
				</div>
			</div>

			{!allProductsDigital && (
				<ShippingRatesSection
					locale={locale}
					onChange={(value) => {
						transition(async () => {
							setShippingRateId(value);
							await saveShippingRateAction({ shippingRateId: value });
							router.refresh();
						});
					}}
					value={shippingRateId}
					shippingRates={shippingRates}
				/>
			)}

			<Label
				className="flex flex-row items-center gap-x-2"
				aria-controls="billingAddressCollapsibleContent"
				aria-expanded={!sameAsShipping}
			>
				<Checkbox
					onCheckedChange={(checked) => {
						setSameAsShipping(checked === true);
					}}
					checked={sameAsShipping}
					name="sameAsShipping"
					value={sameAsShipping ? "true" : "false"}
				/>
				{allProductsDigital ? t("billingSameAsPayment") : t("billingSameAsShipping")}
			</Label>

			<Collapsible className="" open={!sameAsShipping}>
				<CollapsibleContent id="billingAddressCollapsibleContent" className="CollapsibleContent">
					<fieldset
						aria-hidden={sameAsShipping}
						tabIndex={sameAsShipping ? -1 : undefined}
						className={`grid gap-6 rounded-lg border p-4`}
					>
						<legend className="-ml-1 px-1 text-sm font-medium whitespace-nowrap">
							{t("billingAddressTitle")}
						</legend>
						<BillingAddressSection
							values={billingAddressValues}
							onChange={setBillingAddressValues}
							errors={fieldErrors}
						/>
					</fieldset>
				</CollapsibleContent>
			</Collapsible>

			{formErrorMessage && (
				<Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
					<AlertCircle className="-mt-1 h-4 w-4" />
					<AlertTitle>{t("errorTitle")}</AlertTitle>
					<AlertDescription>{formErrorMessage}</AlertDescription>
				</Alert>
			)}

			<Button
				type="submit"
				className="w-full rounded-full text-lg"
				size="lg"
				aria-disabled={isBillingAddressPending || isLoading || isTransitioning}
				onClick={(e) => {
					if (isBillingAddressPending || isLoading || isTransitioning) {
						e.preventDefault();
					}
				}}
			>
				{isBillingAddressPending || isLoading || isTransitioning ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : (
					t("payNowButton")
				)}
			</Button>
		</form>
	);
};

const BillingAddressSection = ({
	values,
	onChange,
	errors,
}: {
	values: AddressSchema;
	onChange: (values: AddressSchema) => void;
	errors: Record<string, string[] | null | undefined>;
}) => {
	const t = useTranslations("/cart.page.stripePayment");
	const onFieldChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.currentTarget;
		onChange({ ...values, [name]: value });
	};

	return (
		<>
			<InputWithErrors
				// required
				label={t("fullName")}
				name="name"
				defaultValue={values.name ?? undefined}
				autoComplete="shipping name"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				// required
				label={t("address1")}
				name="line1"
				defaultValue={values.line1 ?? undefined}
				autoComplete="shipping address-line1"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				label={t("address2")}
				name="line2"
				defaultValue={values.line2 ?? undefined}
				autoComplete="shipping address-line2"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<div className="grid gap-6 sm:grid-cols-2">
				<InputWithErrors
					// required
					label={t("postalCode")}
					name="postalCode"
					defaultValue={values.postalCode ?? undefined}
					autoComplete="shipping postal-code"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
				<InputWithErrors
					// required
					label={t("city")}
					name="city"
					defaultValue={values.city ?? undefined}
					autoComplete="shipping home city"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-1">
				<InputWithErrors
					label={t("state")}
					name="state"
					defaultValue={values.state ?? undefined}
					autoComplete="shipping address-level1"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
				<CountrySelect
					label={t("country")}
					name="country"
					autoComplete="shipping country"
					onChangeValue={(value) => onChange({ ...values, country: value })}
					value={values.country ?? ""}
					errors={errors}
				/>
			</div>
			<InputWithErrors
				// required
				label={t("phone")}
				name="phone"
				defaultValue={values.phone ?? undefined}
				autoComplete="shipping tel"
				type="tel"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				// required
				label={t("taxId")}
				name="taxId"
				defaultValue={values.taxId ?? undefined}
				autoComplete=""
				placeholder={t("taxIdPlaceholder")}
				type="text"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
		</>
	);
};
