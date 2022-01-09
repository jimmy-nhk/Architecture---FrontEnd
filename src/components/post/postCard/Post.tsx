import React, { useEffect, useState } from "react";
// import theme from "../theme";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import "./style.css";
import Box from '@mui/material/Box';
import { PostClass } from "../postContainer/PostContainer"
import { useParams } from "react-router-dom";

interface IPostProps {
  post: PostClass;
}

const Post: React.FC<IPostProps> = ({
  post
}) => {

  let { id } = useParams();

  console.log("test id: " + id)

  return (
    <Card className="cardPost">
      <Box sx={{width: "30%", height: "30%"}}>
        <CardMedia
            className="media"
            title="My Post">
            <img src={post.coverUrl} style={{width: "150px", height: "150px", margin: "10px"}} />
          </CardMedia>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {post.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {id}
            {post.tagline}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <CardActions>
            <Button size="small" color="primary">
              Like
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Box>
      </Box>
    </Card>
  );
}

export default Post;
