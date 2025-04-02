"use client";
import useMembershipYearsQuery from "@/hooks/queries/useMembershipYearsQuery";
import LoadingComponent from "../loading";
import { useEffect, useState } from "react";
import { Option, Select, Typography } from "@mui/joy";

const MembershipList = () => {
  const { data: membershipYears, isLoading: yearsLoading } =
    useMembershipYearsQuery();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    setSelectedYear(
      membershipYears && membershipYears.length > 0
        ? membershipYears.reverse()[0]
        : null,
    );
  }, [membershipYears]);

  /*const { data: unpaidMemberships, isLoading: unpaidLoading } =
    useUnpaidMembershipsQuery(selectedYear ?? 0, selectedYear !== null);*/

  if (yearsLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Select variant="soft" size="md" sx={{ marginBottom: "3em" }}>
        <Option value={2024}>2024</Option>
        <Option value={2025}>2025</Option>
      </Select>
      <Typography level="h2">Unpaid memberships</Typography>
    </>
  );
};

export default MembershipList;
