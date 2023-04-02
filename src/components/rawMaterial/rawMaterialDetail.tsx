import { Typography } from '@mui/material';
import { RawMaterial } from '../../models/recipe';

type RawMaterialDetailProps = {
    material: RawMaterial,
}

export const RawMaterialDetail = (props: RawMaterialDetailProps) => {
  const { material } = props;

  return (
    <Typography>{material.name}</Typography>
  );
};