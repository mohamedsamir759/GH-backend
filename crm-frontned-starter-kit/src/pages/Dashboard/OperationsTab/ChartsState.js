import React from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { Row } from "reactstrap";

export default function ChartsState({seriesTitle, seriesData}) {
  const { layoutMode } = useSelector((state) => state.Layout);


  const options = {
    chart: {
      type: "line",
      height: 140,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: "smooth"
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        show: false,
      }
    },
    colors: layoutMode === "light" ? ["#395B77"] : ["#F89622"],
    series: [
      {
        name: seriesTitle || "Series 1",
        data: seriesData || [],
      },
    ],
  };

  return (
    <Row className="sparkboxes">
      <ReactApexChart options={options} series={options.series} type="line" height={150} />
    </Row>
  );
}
