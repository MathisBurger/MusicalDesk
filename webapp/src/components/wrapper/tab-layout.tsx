import { Tab, TabList, Tabs } from "@mui/joy";
import { PropsWithChildren } from "react";

interface TabLayoutProps extends PropsWithChildren<unknown> {
  tabs: string[];
}

const TabLayout = ({ tabs, children }: TabLayoutProps) => {
  return (
    <Tabs defaultValue={0} sx={{ bgcolor: "transparent" }}>
      <TabList>
        {tabs.map((tab, i) => (
          <Tab value={i} key={i}>
            {tab}
          </Tab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
};

export default TabLayout;
