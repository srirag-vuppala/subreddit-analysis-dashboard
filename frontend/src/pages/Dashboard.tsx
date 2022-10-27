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
} from "@chakra-ui/react";
import React, { Suspense, useEffect, useState } from "react";
import {
  Await,
  defer,
  useAsyncValue,
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
import { commonLengthInTitles, commonWordsInTitles, postsByDayOfWeek, postsByHourOfDay } from "../utils";

const serverUrl = process.env.REACT_APP_SERVER_URL || "http://127.0.0.1:5000";

async function DashboardLoader({ params }) {
  return defer({
    subredditInfo: fetch(
      `${serverUrl}/get-subreddit-info?subreddit=${params.subreddit}&limit=50`
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

const DashboardContent = ({ subredditInfo }: any) => {

  const [data, setData] = useState(subredditInfo)
  const textColor = useColorModeValue("DimGray", "WhiteSmoke");
  const { colorMode, toggleColorMode } = useColorMode();
  const darkMode: boolean = colorMode === "dark";

  return (
    <>
      <Box>Filters</Box>

      <SimpleGrid columns={3} spacing={1}>
        {/* Day of week */}
        <RoundBox margin={5} padding={5}>
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

        {/* hour of the day */}
        <RoundBox margin={5} padding={5}>
          <Center>
            <Heading as="h5" size="sm">
              Posts made by hour of the day
            </Heading>
          </Center>

          <Box marginTop={-10}>
            <RadarChart
              cx={250}
              cy={250}
              outerRadius={150}
              width={550}
              height={450}
              data={postsByHourOfDay(subredditInfo)}
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

        {/* top 10 common words */}
        <RoundBox margin={5} padding={5}>
          <Center>
            <Heading as="h5" size="sm">
              Top 10 most common words in titles
            </Heading>
          </Center>

          <Box mt={8}>
            <Treemap
              width={600}
              height={350}
              data={commonWordsInTitles(subredditInfo)}
              dataKey="size"
              stroke="#fff"
              fill="var(--chakra-colors-brand-400)"
            >
              <Tooltip content={<TreeMapCustomTooltip />} />
              <Legend />
            </Treemap>
          </Box>
        </RoundBox>
        {/* top 5 common title lengths */}
        <RoundBox margin={5} padding={5}>
          <Center>
            <Heading as="h5" size="sm">
              Top 5 most common title lengths (# words)
            </Heading>
          </Center>
          <ComposedChart
            layout="vertical"
            width={600}
            height={400}
            data={commonLengthInTitles(subredditInfo)}
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
    </>
  );
};

const Dashboard = () => {
  const { subreddit } = useParams();
  const { subredditInfo }: any = useLoaderData();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  // const textColor = colorMode === 'light' ? "DimGray" : "WhiteSmoke"

  return (
    <>
      <Box margin={4} padding={5}>
        <Flex>
          <Heading> r/{subreddit} Dashboard </Heading>
          <ColorModeSwitcher />
        </Flex>
      </Box>

      <Suspense
        fallback={
          <Flex justifyContent="center" alignItems="center" height="80vh">
            <Spinner size="xl" />
          </Flex>
        }
      >
        <Await
          resolve={subredditInfo}
          errorElement={<p>Error loading subreddit Info!</p>}
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
