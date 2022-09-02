import React from "react";
import { Box, Skeleton } from "@mui/material";

const CardsContentLoader = () => {
  return (
    <Box>
      <Skeleton variant="rectangular" width={410} height={68} />
      <Skeleton width="60%" />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Box>
  );
};

export default CardsContentLoader;
