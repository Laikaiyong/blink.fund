import worldMill from '@react-jvectormap/world/worldMill.json';

import dynamic from 'next/dynamic';

const VectorMap = dynamic(
  () => import("@react-jvectormap/core").then((m) => m.VectorMap),
  { ssr: false, }
);


export default function CustomMap() {
    const mapData = {
      US: 1000,
      IN: 750,
      GB: 1000,
      CN: 1500,
      JP: 1300,
      DE: 1100,
    };
    return (
    <VectorMap
      map={worldMill}
      markers={mapData}
      backgroundColor="transparent"
      containerStyle={{
        width: "100%",
        height: "100%",
      }}
      containerClassName="map"
      onRegionTipShow={function regionsTooltipHandler(_, label, code) {
        return label.html(`
                        <div style="background-color: ${
                          "#f3f4f6"
                        }; color: ${
          "#000000"
        }; padding: 10px; border-radius: 4px;">
                          <strong>${label.html()}</strong><br/>
                          Funding: $${mapData[code] || 0}
                        </div>
                      `);
      }}
      series={{
        regions: [
          {
            values: mapData,
            scale: ["#AB9EF2", "#512DA8"],
            normalizeFunction: "polynomial",
          },
        ],
      }}
    />
  );
}
