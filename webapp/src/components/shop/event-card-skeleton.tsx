import { AspectRatio, Card, Skeleton, Typography } from "@mui/joy";

const EventCardSkeleton = () => {
  return (
    <Card variant="outlined">
      <AspectRatio ratio="1/1">
        <Skeleton variant="overlay">
          <img
            alt=""
            src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
          />
        </Skeleton>
      </AspectRatio>
      <Typography>
        <Skeleton>
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries.
        </Skeleton>
      </Typography>
    </Card>
  );
};

export default EventCardSkeleton;
