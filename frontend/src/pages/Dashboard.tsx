import {
  Box,
  Text,
  Center,
  Flex,
  Heading,
  Spinner,
  useColorMode,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Menu,
  MenuButton,
  Button,
  MenuItem,
  MenuList,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Input,
  Badge,
  Checkbox,
} from "@chakra-ui/react";
import React, { Suspense, useState } from "react";
import {
  Await,
  defer,
  useLoaderData,
  useNavigation,
  useParams,
} from "react-router-dom";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  Label,
} from "recharts";
import RoundBox from "../components/RoundBox";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import Navbar from "../components/Navbar";
import {
  commonLengthInTitles,
  commonWordsInTitles,
  PostItem,
  postsByDayOfWeek,
  postsByHourOfDay,
} from "../utils";
import { useLocalStorage } from "usehooks-ts";
import { FaChevronDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const serverUrl = process.env.REACT_APP_SERVER_URL || "http://127.0.0.1:5000";

interface FilterObject {
  name?: string;
  inUse?: boolean;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
}

async function DashboardLoader({ params }) {
  return defer({
    subredditInfo: fetch(
      `${serverUrl}/get-subreddit-info?subreddit=${params.subreddit}&limit=500` 
    ).then((r) => r.json()),
  });
}

const TreeMapCustomTooltip = ({ active, payload, label }) => {
  const bgColor = useColorModeValue("WhiteSmoke", "DimGray");
  if (active && payload && payload.length) {
    return (
      <Box
        className="custom-tooltip"
        w="fit-content"
        bgColor={bgColor}
        p={3}
        borderRadius="lg"
      >
        <Text>{`${payload[0].payload.name} : ${payload[0].value}`}</Text>
      </Box>
    );
  }
  return null;
};

const BarCustomTooltip = ({ active, payload, label }) => {
  const bgColor = useColorModeValue("WhiteSmoke", "DimGray");
  if (active && payload && payload.length) {
    return (
      <Box
        className="custom-tooltip"
        w="fit-content"
        bgColor={bgColor}
        p={3}
        borderRadius="lg"
      >
        <Text className="label">{`${label} : ${payload[0].value}`}</Text>
      </Box>
    );
  }
  return null;
};

interface FilterComponentProps {
  data: PostItem[];
  setData: (data: PostItem[]) => any;
}
const FilterComponent = ({ data, setData }: FilterComponentProps) => {
  const [filters, setFilters] = useLocalStorage(
    "Filters",
    [] as FilterObject[]
  );
  const [menuText, setMenuText] = useState("Existing Filters");

  const [startDate, setStartDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [filterName, setFilterName] = useState("");

  const CreateFilter = () => {
    let filter: FilterObject = {
      startTime: startTime,
      endTime: endTime,
      startDate: startDate,
      endDate: endDate,
      inUse: false,
      name: filterName,
    };
    setFilters((prev) => [...prev, filter]);
  };
  const UnApplyFilters = () => {
    // reset
    setData(data);
  };
  const ApplyFilter = ({ startDate, endDate, startTime, endTime }) => {
    let newData: PostItem[] = data.filter((val: PostItem) => {
      let itemDate = new Date(val.created_utc * 1000).getTime();
      return itemDate > startDate.getTime() && itemDate < endDate.getTime();
    });

    if (startTime && endTime) {
      newData = newData.filter(
        (val: PostItem) =>
          val.hour > parseInt(startTime.split(":")[0]) &&
          val.hour < parseInt(endTime.split(":")[0])
      );
    }
    setData(newData);
  };

  const RemoveFilter = ({ name }) => {
    let newData = filters.filter((val: FilterObject) => val.name !== name);
    setFilters(newData);
  };

  const updateFilter = ({ val }) => {
    setStartDate(new Date(val.startDate));
    setStartTime(val.startTime);
    setEndTime(val.endTime);
    setEndDate(new Date(val.endDate));
    setMenuText(val.name);
  };

  return (
    <RoundBox margin={5} padding={5} width="30%">
      <Heading as="h4" size="md">
        Filters
      </Heading>
      <Divider py={2} />

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Create/Apply an Filter</Tab>
          <Tab>Apply an Existing Filter</Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="create-filter">
            <Box>
              <Box>
                <Text>Filter Name</Text>
                <Input
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </Box>
              <Box>
                <Text>Date Range</Text>
                <HStack p={5}>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                  />
                  <Text>-</Text>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                  />
                </HStack>
              </Box>

              <Box>
                <Text>Time Range</Text>
                <HStack p={5}>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Text>-</Text>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </HStack>
              </Box>

              <Center p={5} id="create-filter-action-buttons">
                <HStack>
                  <Button
                    onClick={() =>
                      ApplyFilter({
                        startDate: startDate,
                        endDate: endDate,
                        startTime: startTime,
                        endTime: endTime,
                      })
                    }
                  >
                    Apply Filter
                  </Button>
                  <Button onClick={CreateFilter}>Create Filter</Button>
                  <Button onClick={() => UnApplyFilters()}>
                    Remove Filters
                  </Button>
                </HStack>
              </Center>
            </Box>
          </TabPanel>

          <TabPanel className="select-filter">
            <Center>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                  {menuText}
                </MenuButton>
                <MenuList>
                  {filters.length !== 0 ? (
                    filters.map((val, idx) => {
                      return (
                        <MenuItem
                          onClick={() => updateFilter({ val: val })}
                          gap={5}
                        >
                          <Text>{val.name}</Text>
                          <Badge
                            onClick={() => RemoveFilter({ name: val.name })}
                            colorScheme="red"
                          >
                            DELETE
                          </Badge>
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem>No items</MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Center>
            <Center p={5}>
              <HStack>
                <Button
                  onClick={() =>
                    ApplyFilter({
                      startDate: startDate,
                      endDate: endDate,
                      startTime: startTime,
                      endTime: endTime,
                    })
                  }
                >
                  Apply Filter
                </Button>
                <Button onClick={() => UnApplyFilters()}>Remove Filters</Button>
              </HStack>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </RoundBox>
  );
};

const DashboardContent = ({ subredditInfo }: any) => {
  const [data, setData] = useState(subredditInfo);
  const textColor = useColorModeValue("DimGray", "WhiteSmoke");
  const { colorMode, toggleColorMode } = useColorMode();
  const darkMode: boolean = colorMode === "dark";
  const [nounCheck, setNounCheck] = useState(false);

  return (
    <>
      <Flex justifyContent="space-between">
        <FilterComponent data={[...subredditInfo]} setData={setData} />
        <SimpleGrid columns={2} spacing={1}>
          <RoundBox id="day-of-week" margin={5} padding={5}>
            <Center>
              <Heading as="h5" size="sm">
                Posts made by day of the week
              </Heading>
            </Center>
            <ComposedChart
              layout="vertical"
              width={600}
              height={400}
              data={postsByDayOfWeek(data)}
              margin={{
                top: 20,
                right: 30,
                bottom: 0,
                left: 40,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" tick={{ fill: textColor }} />
              <YAxis
                dataKey="day"
                type="category"
                scale="band"
                tick={{ fill: textColor }}
              />
              <Tooltip content={<BarCustomTooltip />} />
              <Legend />
              <Bar
                dataKey="count"
                barSize={20}
                fill="var(--chakra-colors-brand-400)"
              />
            </ComposedChart>
          </RoundBox>

          <RoundBox id="hour-of-the-day" margin={5} padding={5}>
            <Center>
              <Heading as="h5" size="sm">
                Posts made by hour of the day [PST]
              </Heading>
            </Center>

            <Box marginTop={-10}>
              <RadarChart
                cx={250}
                cy={250}
                outerRadius={150}
                width={550}
                height={450}
                data={postsByHourOfDay(data)}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="time" />
                <PolarRadiusAxis angle={90} />
                <Radar
                  name="AM"
                  dataKey="AM"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="PM"
                  dataKey="PM"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip content={<BarCustomTooltip />} />
              </RadarChart>
            </Box>
          </RoundBox>

          <RoundBox id="common-words-graph" margin={5} padding={5}>
            <Center gap={2}>
              <Heading as="h5" size="sm">
                Top 10 most common words in titles
              </Heading>
              <Checkbox isChecked={nounCheck} onChange={() => setNounCheck(!nounCheck)}>Noun Only</Checkbox>
            </Center>

            <Box mt={8}>
              <Treemap
                width={600}
                height={350}
                data={commonWordsInTitles(data, nounCheck)}
                dataKey="size"
                stroke="#fff"
                fill="var(--chakra-colors-brand-400)"
              >
                <Tooltip content={<TreeMapCustomTooltip />} />
                <Legend />
              </Treemap>
            </Box>
          </RoundBox>

          <RoundBox id="common-title-lengths" margin={5} padding={5}>
            <Center>
              <Heading as="h5" size="sm">
                Top 5 most common title lengths (# words)
              </Heading>
            </Center>
            <ComposedChart
              layout="vertical"
              width={600}
              height={400}
              data={commonLengthInTitles(data)}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" tick={{ fill: textColor }}></XAxis>
              <YAxis
                dataKey="title_length"
                type="category"
                scale="band"
                tick={{ fill: textColor }}
              >
                <Label
                  value="Number of words in title"
                  position="insideBottomLeft"
                  angle={-90}
                  offset={20}
                />
              </YAxis>
              <Tooltip content={<BarCustomTooltip />} />
              <Legend />
              <Bar
                dataKey="count"
                barSize={20}
                fill="var(--chakra-colors-brand-400)"
              />
            </ComposedChart>
          </RoundBox>
        </SimpleGrid>
      </Flex>
    </>
  );
};

const Dashboard = () => {
  const { subreddit } = useParams();
  const { subredditInfo }: any = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      <Navbar>
        <RoundBox>
          <Flex alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              r/{subreddit}
            </Text>
          </Flex>
        </RoundBox>
      </Navbar>

      <Suspense
        fallback={
          <Flex justifyContent="center" alignItems="center" height="80vh">
            <Spinner size="xl" />
          </Flex>
        }
      >
        <Await
          resolve={subredditInfo}
          errorElement={
            <Center>
              <Box>Error loading subreddit Info!</Box>
            </Center>
          }
        >
          {(subredditInfo: any) => {
            if (isLoading) {
              return <Spinner />;
            } else {
              return <DashboardContent subredditInfo={subredditInfo} />;
            }
          }}
        </Await>
      </Suspense>
    </>
  );
};

export { Dashboard, DashboardLoader };
