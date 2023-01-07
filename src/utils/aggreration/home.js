export function getTopCoursePipeline() {
    return [
        {
          $match: {
            createdAt: {
              //TODO: change to 7 days after integrating enrollment
              $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        },
        {
          $group: {
            _id: '$course',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 3,
        },
        {
          $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: '_id',
            as: 'course',
          },
        },
        {
          $unwind: {
            path: '$course',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'course.instructor',
            foreignField: '_id',
            as: 'instructor',
          },
        },
        {
          $unwind: {
            path: '$instructor',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'course.coverPhoto',
            foreignField: '_id',
            as: 'coverPhoto',
          },
        },
        {
          $unwind: {
            path: '$coverPhoto',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: '$course.name',
            slug: '$course.slug',
            price: '$course.price',
            instructor: {
              name: '$instructor.name',
            },
            coverPhoto: '$coverPhoto.filename',
          },
        },
    ]
}