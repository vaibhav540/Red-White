import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Course } from '@/interfaces/course';

const courses: Course[] = [
  {
    id: '1',
    title: 'Course 1',
    cover: '/path/to/cover1.jpg',
    rating: 4.5,
    ratingCount: 100,
    price: 99.99,
    category: 'Web Development',
  },
  {
    id: '2',
    title: 'Course 2',
    cover: '/path/to/cover2.jpg',
    rating: 4.0,
    ratingCount: 50,
    price: 49.99,
    category: 'Data Science',
  },
];

const CourseDetails = () => {
  const router = useRouter();
  const { id } = router.query; 

  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (id) {
      const foundCourse = courses.find((course) => course.id === id);
      setCourse(foundCourse || null); 
    }
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <img src={course.cover} alt={course.title} width={760} height={400} />
        <Typography variant="h3" sx={{ mt: 2 }}>
          {course.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating name="course-rating" value={course.rating} max={5} readOnly />
          <Typography component="span" variant="h6" sx={{ ml: 1 }}>
            ({course.ratingCount} ratings)
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ mt: 2 }}>
          ${course.price}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Category: {course.category}
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Course Description:
        </Typography>
        <Typography variant="body1"></Typography>
      </Box>
    </Box>
  );
};

export default CourseDetails;
