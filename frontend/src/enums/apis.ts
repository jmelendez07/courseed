enum APIS {
    USERS = 'api/users',
    USER_AUTHENTICATED = 'api/auth',
    LOGIN = 'api/auth/login',
    REGISTER = 'api/auth/register',
    COURSES = 'api/courses',
    COURSES_SEARCH = 'api/courses/search',
    COURSES_BY_INSTITUTION = 'api/courses/institution',
    COURSES_BY_FACULTY = 'api/courses/category',
    COURSES_REVIEWS_LIKES_COUNT = 'api/courses/reviews-likes/count',
    COURSES_CREATE = 'api/courses',
    COURSES_UPDATE = 'api/courses/',
    COURSES_DELETE = 'api/courses/',
    INSTITUTIONS = 'api/institutions',
    INSTITUTIONS_COURSES_COUNT = 'api/institutions/courses/count',
    REVIEWS = 'api/reviews',
    REVIEWS_UPDATE = 'api/reviews/',
    REVIEWS_DELETE = 'api/reviews/',
    FACULTIES = 'api/categories'
}

export default APIS;