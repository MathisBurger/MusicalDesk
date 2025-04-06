"use client";
import useMembershipYearsQuery from "@/hooks/queries/useMembershipYearsQuery";
import LoadingComponent from "../loading";
import { useState } from "react";
import { Option, Select, Typography } from "@mui/joy";
import useUnpaidMembershipsQuery from "@/hooks/queries/useUnpaidMembershipsQuery";
import usePaidMembershipsQuery from "@/hooks/queries/usePaidMembershipsQuery";
import DisplayMembershipList from "./display-membership-list";

const MembershipList = () => {
  const { data: membershipYears, isLoading: yearsLoading } =
    useMembershipYearsQuery();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data: unpaidMemberships, isLoading: unpaidLoading } =
    useUnpaidMembershipsQuery(selectedYear ?? 0, selectedYear !== null);

  const { data: paidMemberships, isLoading: paidLoading } =
    usePaidMembershipsQuery(selectedYear ?? 0, selectedYear !== null);

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
        Unpaid memberships
      </Typography>
      <DisplayMembershipList
        loading={unpaidLoading}
        members={unpaidMemberships ?? []}
        selectedYear={selectedYear ?? 0}
        canPay
      />
      <Typography level="h2" sx={{ marginTop: "1.5em" }}>
        Paid memberships
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
