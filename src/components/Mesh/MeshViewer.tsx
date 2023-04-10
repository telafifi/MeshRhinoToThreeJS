import * as Z from '@iconbuild/izzy';
import { Button } from '@iconbuild/quarks';
import { Mesh } from './types';
import { generateSitePlanFromMeshImport } from './slice';
import { loadFile } from 'utils/load-file';
import { useState } from 'react';
import RangeInput from '../RangeInput';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import type { SitePlan3D } from '@iconbuild/hubble';

const SitePlan3DDynamic: typeof SitePlan3D = dynamic(
  () => import('@iconbuild/hubble').then((hubble) => hubble.SitePlan3D),
  { ssr: false },
) as typeof SitePlan3D;

const MeshViewer = () => {
  const [progress, setProgress] = useState(1.0);
  const [sitePlan, setSitePlan] = useState<Z.SitePlan | null>(null);

  const processJson = (json: string) => {
    try {
      const parsed = JSON.parse(json) as Mesh[];

      setSitePlan(generateSitePlanFromMeshImport(parsed, 0.75));
    } catch (err) {
      setSitePlan(null);
      console.error(err);
    }
  };
  return (
    <Container>
      <Button
        isFileInput
        onChange={async (e) => {
          const result = await loadFile(e);
          processJson(result);
        }}
      >
        Import Mesh
      </Button>
      {sitePlan && (
        <ControlsContainer>
          <RangeInput
            type="range"
            step={0.005}
            min={0.0}
            max={1.0}
            value={progress}
            onChange={(e) => setProgress(parseFloat(e.target.value))}
          />
        </ControlsContainer>
      )}
      {sitePlan && (
        <SitePlan3DDynamic
          sitePlan={sitePlan}
          progress={progress}
          minHeight="600px"
          showFoundation={false}
          beadHeightInches={0.75}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  position: absolute;
  justify-content: start;
  align-items: center;
  padding: 0.5rem;
  z-index: 2;
`;

export default MeshViewer;
