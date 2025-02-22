enum APIS {
    USERS = 'api/users',
    USER_AUTHENTICATED = 'api/auth',
    USER_UPDATE_EMAIL = 'api/users/email/',
    USER_UPDATE_PASSWORD = 'api/users/password/',
    USER_UPDATE_ROLES = 'api/users/roles/',
    USER_DELETE = 'api/users/',
    LOGIN = 'api/auth/login',
    REGISTER = 'api/auth/register',
    COURSES = 'api/courses',
    COURSES_SEARCH = 'api/courses/search',
    COURSES_BY_INSTITUTION = 'api/courses/institution',
    COURSES_BY_FACULTY = 'api/courses/category',
    COURSES_REVIEWS_LIKES_COUNT = 'api/courses/reviews-likes/count',
    COURSES_WITH_RATING_AVG = 'api/courses/reviews/avg',
    COURSES_CREATE = 'api/courses',
    COURSES_UPDATE = 'api/courses/',
    COURSES_DELETE = 'api/courses/',
    INSTITUTIONS = 'api/institutions',
    INSTITUTIONS_COURSES_COUNT = 'api/institutions/courses/count',
    REVIEWS = 'api/reviews',
    REVIEWS_COUNT_BY_MONTH = 'api/reviews/months/count',
    REVIEWS_UPDATE = 'api/reviews/',
    REVIEWS_DELETE = 'api/reviews/',
    FACULTIES = 'api/categories'
}

export default APIS;