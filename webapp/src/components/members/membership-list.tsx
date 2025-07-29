"use client";
import useMembershipYearsQuery from "@/hooks/queries/membership/useMembershipYearsQuery";
import LoadingComponent from "../loading";
import { useState } from "react";
import { Option, Select, Typography } from "@mui/joy";
import useUnpaidMembershipsQuery from "@/hooks/queries/membership/useUnpaidMembershipsQuery";
import usePaidMembershipsQuery from "@/hooks/queries/membership/usePaidMembershipsQuery";
import DisplayMembershipList from "./display-membership-list";
import { useTranslations } from "next-intl";

const MembershipList = () => {
  const { data: membershipYears, isLoading: yearsLoading } =
    useMembershipYearsQuery();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: unpaidMemberships, isLoading: unpaidLoading } =
    useUnpaidMembershipsQuery(selectedYear ?? 0, selectedYear !== null);

  const { data: paidMemberships, isLoading: paidLoading } =
    usePaidMembershipsQuery(selectedYear ?? 0, selectedYear !== null);

  const t = useTranslations();

  if (yearsLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Select
        variant="outlined"
        size="md"
        value={selectedYear}
        defaultValue={new Date().getFullYear()}
        onChange={(_e, newValue) => setSelectedYear(parseInt(`${newValue}`))}
      >
        {(membershipYears ?? []).map((year) => (
          <Option key={year} value={year}>
            {year}
          </Option>
        ))}
      </Select>
      <Typography level="h2" sx={{ marginTop: "1.5em" }}>
        {t("tabs.member.unpaidMemberships")}
      </Typography>
      <DisplayMembershipList
        loading={unpaidLoading}
        members={unpaidMemberships ?? []}
        selectedYear={selectedYear ?? 0}
        canPay
      />
      <Typography level="h2" sx={{ marginTop: "1.5em" }}>
        {t("tabs.member.paidMemberships")}
      </Typography>
      <DisplayMembershipList
        loading={paidLoading}
        members={paidMemberships ?? []}
        selectedYear={selectedYear ?? 0}
      />
    </>
  );
};

export default MembershipList;
