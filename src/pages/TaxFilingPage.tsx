
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import TaxFilingWizard from "@/components/tax-filing/TaxFilingWizard";

const TaxFilingPage: React.FC = () => {
  return (
    <MainLayout requiredPermission="view_own_returns">
      <TaxFilingWizard />
    </MainLayout>
  );
};

export default TaxFilingPage;
