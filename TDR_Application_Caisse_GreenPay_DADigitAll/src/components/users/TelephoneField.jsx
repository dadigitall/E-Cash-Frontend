import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function TelephoneField({
  value,
  onChange,
  label = "Téléphone WhatsApp",
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <PhoneInput
        international
        defaultCountry="BJ"
        value={value}
        onChange={onChange}
        className="phone-input-custom"
      />
    </div>
  );
}
