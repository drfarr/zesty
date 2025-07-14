# Zesty.ai 🍋 - A Foodwaste Management Application 

Zesty.ai is a food waste management application designed to help users track and manage their food inventory, reducing waste and promoting sustainability. The application features user authentication, ingredient management, and an analytics dashboard to visualize food waste data.

## Setup Instructions

There is a "proper" way to do this and this means not committing the `.env.local` file to your repository.

Instead, you should create a `.env.local.example` file with the necessary environment variables and instructions for setting them up.

BUT for simplicity, we will create a `.env.local` file directly in this project and commit it. This is not recommended for production, but it is fine for local development and will prevent lots of faffing about!

1. Install dependencies:
   ```bash
   pnpm i
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

## Design Decisions Made

I am only ever focused on creating a product, so I made some decisions that are not necessarily best practices but are pragmatic for getting something working.
There obviously quite alot of work here, from a code perspective I think the approach is slightly more quanitative than qualitative, but it is a good starting point for a more robust application.
I used a combination of Windsurf and Copiolet, these largely were used to generate the initial code and then I iterated on it to make it more suitable for this project.

Because of this approach I wasn't really focusing on atomic commits or working on a single feature at a time, in a traditional sense. It was a failty freeform approach, so the commit history is a bit messy and there are some changes that are not directly related to the feature being worked on at the time.

My start was with the marketing site of the home page, although this is a technical challenge, it's important to tell a story.

From here I added the authentication system, which is a key feature of the application. I used Auth.js to handle the authentication flow, which is a well-established library for this purpose.
it makes it fairly easy to add third-party authentication providers, and opted for added a single single provider google for a one click login.

From here I created the database schemas and a database seed to enable me to rapidlty develop the application without having to worry about the data layer too much.
I started on the filtering and sorting of the data, which is a key feature of the application. My theory was that by doing this I would be able to understand the data model better and would allow me to think get a better understanding of being able to visualise the data in a more meaningful way.

By doing this I was able to design a few basic REST API endpoints to allow the front-end to interact with the data layer.
This led to the creation of the admin dashboard, which is the core of the application. The UI is largely borrowed from other projects I've created which allowed me to rapidly protoype the application.

Lastly I focused on the analytics dashboard. This was a slightly less complex task as I had created a plan for this while beomcing familiar with the API endpoints.

### Architecture Choices
- **App Router over Pages Router**: Leveraged Next.js 15's App Router for improved performance, better data fetching patterns, and enhanced developer experience with nested layouts and server components.
- **Auth.js Integration**: Chosen over custom authentication solutions for its comprehensive provider support, security best practices, and seamless Next.js integration.
- **Prisma ORM**: Selected for type-safety, excellent TypeScript support, and intuitive database schema management with migrations.
- **ZOD prisma generate**: Used to generate TypeScript types from Prisma schemas, ensuring type safety across the application.
- **API class**: This was a bit of a whacky choice but decided to create a class to handle API requests, which allows for better organization and reusability of API-related logic, eventually in the flurry I gave up on this when getting to analytics but it was really useuful for filtering and sorting the data.
- **REST API**: Opted for a RESTful API design to keep the architecture maintainable.

### Stack
- **Next.js 15 (App Router)**: Utilizing the latest React framework
- **ESLint 9**: Latest version of ESLint (flat config)
- **Auth.js**: Easy implementation of a secure authentication system
- **Tailwind CSS**: Customizable utility-first CSS framework
- **shadcn/ui**: Functional UI components
- **Prisma**: Efficient database operations with a type-safe ORM
- **PostgreSQL**: Reliable relational database.

### Technology Stack Rationale
- **PostgreSQL**: Chosen for its robustness, ACID compliance, and excellent support for complex queries and relationships.
- **Tailwind CSS + shadcn/ui**: Combined utility-first styling with pre-built, accessible components to accelerate development while maintaining design consistency.
- **Package Manager**: Used `pnpm` for faster installations and better dependency management compared to npm/yarn.
- **Vercel**: Selected as the deployment platform for its seamless integration with Next.js, automatic scaling, and built-in support for serverless functions. 

## Known Limitations & Areas for Improvement

### Security Considerations
- **Environment Variables**: Current setup commits `.env.local` to the repository, which is not production-ready.
- **Session Configuration**: Only a few of the endpoints are protected by session validation, which is not ideal for a production application. Should implement more comprehensive session management and validation, I did it for a few of the endpoints but not all.

### Development Experience
- **Seeding**: seeding allowed me to rapidly develop the application, but the current seed data is minimal and should be expanded for more comprehensive testing.
- **Type Safety**: While Prisma provides type safety for database operations, API routes could benefit from additional type validation (e.g., Zod schemas).
- **Error Handling**: Basic error handling implementation - needs comprehensive error boundaries and user-friendly error pages.

### Performance
- **Queries**: There's alot to be desired in terms of query optimization, especially for calling the analytics endpoints, it's fairly inefficient and scappy but it works.
- **SSR**: Server-side rendering is implemented but in some cases, it could be optimized further to reduce initial load times and often under utilised.

### Feature Gaps
- **User Management**: Basic authentication only - missing user profile management, password reset, and email verification.
- **Role-Based Access Control**: No RBAC implementation for different user permission levels.
- **Testing**: No automated tests are implemented, which is crucial for maintaining code quality and reliability. My excuse is that I was thinking of this like a prototype, but it should be a priority to add tests for critical functionality.

### Future Enhancements

1. Implement comprehensive testing suite
2. Add proper environment variable management
3. Integrate monitoring and logging solutions
4. Implement advanced authentication features (2FA, social logins)
5. Implement proper error handling and user feedback systems

