import { FormInputProps } from "@/form/form-input";
import { Language } from "@/types/api/user";
import { Option, Select } from "@mui/joy";
import { useTranslations } from "next-intl";

type LanguageSelectProps = Pick<
  FormInputProps,
  "defaultValue" | "name" | "value" | "setValue"
>;

const LanguageSelect = ({
  name,
  value,
  setValue,
  defaultValue,
}: LanguageSelectProps) => {
  const t = useTranslations();
  return (
    <Select
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={
        setValue ? (_, newValue) => setValue(newValue as string) : undefined
      }
    >
      {Object.values(Language).map((lang) => (
        <Option value={lang} key={lang}>
          {t(`language.${lang}`)}
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelect;
