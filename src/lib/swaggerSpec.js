/**
 * OpenAPI 3.0 specification for Raghvendra Saini Campaign Portal API
 * Served at /api/swagger-spec
 */

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Raghvendra Saini Campaign Portal API",
    description:
      "REST API powering the Raghvendra Saini political campaign website. " +
      "All data is persisted in Google Cloud Firestore. " +
      "Admin write endpoints (POST/DELETE) require an authenticated Firebase session cookie.",
    version: "1.0.0",
    contact: {
      name: "Raghvendra Saini Campaign Team",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Current deployment (relative)",
    },
  ],
  tags: [
    { name: "Profile", description: "Candidate profile & biography" },
    { name: "Thoughts", description: "Blog posts & opinion pieces" },
    { name: "Timeline", description: "Political journey & RSS roles" },
    { name: "Organizational", description: "RSS organisational work achievements" },
    { name: "Media", description: "Press mentions & media coverage" },
    { name: "Gallery", description: "Photo gallery items" },
    { name: "Community", description: "Community initiatives" },
    { name: "Analytics", description: "Site analytics counters" },
    { name: "Settings", description: "Global site settings & privacy toggles" },
    { name: "Upload", description: "Cloudinary image upload" },
  ],
  paths: {
    // ─────────────── PROFILE ───────────────────────────────────────────────────
    "/profile": {
      get: {
        tags: ["Profile"],
        summary: "Get candidate profile",
        description: "Returns the full profile document from Firestore.",
        responses: {
          200: {
            description: "Profile object",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Profile" },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      post: {
        tags: ["Profile"],
        summary: "Create or update candidate profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Profile" },
            },
          },
        },
        responses: {
          200: {
            description: "Updated profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Profile" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── THOUGHTS ──────────────────────────────────────────────────
    "/thoughts": {
      get: {
        tags: ["Thoughts"],
        summary: "List published thoughts / blog posts",
        description:
          "Returns all thoughts ordered by date descending. " +
          "If no query params are provided, returns a bare array for backward compatibility. " +
          "When any filter param is supplied, returns a paginated envelope.",
        parameters: [
          {
            name: "search",
            in: "query",
            description: "Full-text search across titleHi, titleEn, descHi, descEn, tags",
            schema: { type: "string" },
          },
          {
            name: "category",
            in: "query",
            description: "Filter by exact tag value",
            schema: { type: "string" },
          },
          {
            name: "status",
            in: "query",
            description: "Filter by status",
            schema: { type: "string", enum: ["published", "draft", "scheduled"] },
          },
          {
            name: "page",
            in: "query",
            description: "Page number (1-based)",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (0 = all)",
            schema: { type: "integer", default: 12, minimum: 0 },
          },
        ],
        responses: {
          200: {
            description: "Array of thoughts (bare) or paginated envelope",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      type: "array",
                      items: { $ref: "#/components/schemas/Thought" },
                      description: "Bare array when no filter params provided",
                    },
                    { $ref: "#/components/schemas/PaginatedThoughts" },
                  ],
                },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      post: {
        tags: ["Thoughts"],
        summary: "Create or update a thought",
        description: "If the payload contains a `firestoreId` or `id` field that maps to an existing document, it will be updated. Otherwise a new document is created.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ThoughtInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Created or updated thought",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Thought" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      delete: {
        tags: ["Thoughts"],
        summary: "Delete a thought",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            description: "Firestore document ID of the thought to delete",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Thought deleted" },
          400: { $ref: "#/components/responses/BadRequest" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── TIMELINE ──────────────────────────────────────────────────
    "/timeline": {
      get: {
        tags: ["Timeline"],
        summary: "Get political journey timeline",
        responses: {
          200: {
            description: "Array of timeline roles",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/TimelineRole" },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      post: {
        tags: ["Timeline"],
        summary: "Add or update a timeline role",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TimelineRole" },
            },
          },
        },
        responses: {
          200: { description: "Role saved" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      delete: {
        tags: ["Timeline"],
        summary: "Delete a timeline role by index",
        parameters: [
          {
            name: "index",
            in: "query",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Role deleted" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── ORGANIZATIONAL ───────────────────────────────────────────
    "/organizational": {
      get: {
        tags: ["Organizational"],
        summary: "List RSS organisational work achievements",
        responses: {
          200: {
            description: "Array of achievements",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/OrgWork" },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      post: {
        tags: ["Organizational"],
        summary: "Add or update an achievement",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OrgWork" },
            },
          },
        },
        responses: {
          200: { description: "Achievement saved" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      delete: {
        tags: ["Organizational"],
        summary: "Delete an achievement by id",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── MEDIA ─────────────────────────────────────────────────────
    "/media": {
      get: {
        tags: ["Media"],
        summary: "List media coverage items",
        responses: {
          200: {
            description: "Array of media items",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/MediaItem" },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      post: {
        tags: ["Media"],
        summary: "Add or update a media item",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MediaItem" },
            },
          },
        },
        responses: {
          200: { description: "Media item saved" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      delete: {
        tags: ["Media"],
        summary: "Delete a media item by id",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── GALLERY ──────────────────────────────────────────────────
    "/gallery": {
      get: {
        tags: ["Gallery"],
        summary: "List photo gallery items",
        responses: {
          200: {
            description: "Array of gallery items",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/GalleryItem" },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── COMMUNITY ────────────────────────────────────────────────
    "/community": {
      get: {
        tags: ["Community"],
        summary: "List community initiatives",
        description:
          "Returns all community initiatives sorted by id. " +
          "If no query params are provided, returns a bare array. " +
          "When page query param is supplied, returns a paginated envelope.",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number (1-based)",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (0 = all)",
            schema: { type: "integer", default: 6, minimum: 0 },
          },
        ],
        responses: {
          200: {
            description: "Array of community initiatives or paginated envelope",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    {
                      type: "array",
                      items: { $ref: "#/components/schemas/CommunityItem" },
                      description: "Bare array when page parameter is omitted",
                    },
                    { $ref: "#/components/schemas/PaginatedCommunity" },
                  ],
                },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      post: {
        tags: ["Community"],
        summary: "Add or update a community initiative",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommunityItem" },
            },
          },
        },
        responses: {
          200: { description: "Initiative saved" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      delete: {
        tags: ["Community"],
        summary: "Delete an initiative by id",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── ANALYTICS ───────────────────────────────────────────────
    "/analytics": {
      get: {
        tags: ["Analytics"],
        summary: "Get site analytics data",
        responses: {
          200: {
            description: "Analytics document",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Analytics" },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── SETTINGS ────────────────────────────────────────────────
    "/settings": {
      get: {
        tags: ["Settings"],
        summary: "Get global site settings",
        responses: {
          200: {
            description: "Settings document",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Settings" },
              },
            },
          },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
      post: {
        tags: ["Settings"],
        summary: "Update site settings",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Settings" },
            },
          },
        },
        responses: {
          200: { description: "Settings saved" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },

    // ─────────────── UPLOAD ──────────────────────────────────────────────────
    "/upload": {
      post: {
        tags: ["Upload"],
        summary: "Upload an image to Cloudinary",
        description: "Accepts a base64-encoded image data URI and returns the Cloudinary secure URL.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    description: "Base64 data URI of the image (e.g. data:image/jpeg;base64,...)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Cloudinary upload result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: { type: "string", description: "Secure CDN URL" },
                    public_id: { type: "string" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          500: { $ref: "#/components/responses/FirestoreError" },
        },
      },
    },
  },

  // ─────────────── COMPONENTS ────────────────────────────────────────────────
  components: {
    schemas: {
      Profile: {
        type: "object",
        properties: {
          nameHi: { type: "string", example: "राघवेंद्र सैनी" },
          nameEn: { type: "string", example: "Raghvendra Saini" },
          taglineHi: { type: "string" },
          taglineEn: { type: "string" },
          bioHi: { type: "string" },
          bioEn: { type: "string" },
          photoUrl: { type: "string", format: "uri" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          city: { type: "string" },
          state: { type: "string" },
          party: { type: "string" },
        },
      },
      Thought: {
        type: "object",
        properties: {
          id: { type: "string", description: "Firestore document ID" },
          firestoreId: { type: "string" },
          titleHi: { type: "string", example: "डिजिटल भारत की नई राह" },
          titleEn: { type: "string", example: "A New Path for Digital India" },
          descHi: { type: "string", description: "HTML content in Hindi" },
          descEn: { type: "string", description: "HTML content in English" },
          status: {
            type: "string",
            enum: ["published", "draft", "scheduled"],
            default: "draft",
          },
          date: { type: "string", format: "date", example: "2026-06-01" },
          tags: { type: "array", items: { type: "string" } },
          views: { type: "integer", default: 0 },
        },
      },
      ThoughtInput: {
        allOf: [
          { $ref: "#/components/schemas/Thought" },
          {
            description:
              "Same as Thought. Include `id` or `firestoreId` to update an existing record.",
          },
        ],
      },
      PaginatedThoughts: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Thought" },
          },
          total: { type: "integer", description: "Total matching records" },
          page: { type: "integer" },
          totalPages: { type: "integer" },
          limit: { type: "integer" },
        },
      },
      TimelineRole: {
        type: "object",
        properties: {
          id: { type: "string" },
          year: { type: "string", example: "2018" },
          roleHi: { type: "string" },
          roleEn: { type: "string" },
          orgHi: { type: "string" },
          orgEn: { type: "string" },
          cat: {
            type: "string",
            enum: ["political", "rss", "social", "education"],
          },
          active: { type: "boolean", default: false },
        },
      },
      OrgWork: {
        type: "object",
        properties: {
          id: { type: "string" },
          titleHi: { type: "string" },
          titleEn: { type: "string" },
          descHi: { type: "string" },
          descEn: { type: "string" },
          year: { type: "string" },
          icon: { type: "string" },
        },
      },
      MediaItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          source: { type: "string", example: "Dainik Jagran" },
          url: { type: "string", format: "uri" },
          date: { type: "string", format: "date" },
          type: { type: "string", enum: ["print", "tv", "online", "social"] },
          imageUrl: { type: "string", format: "uri" },
        },
      },
      GalleryItem: {
        type: "object",
        properties: {
          docId: { type: "string" },
          id: { type: "integer" },
          url: { type: "string", format: "uri" },
          caption: { type: "string" },
          cat: {
            type: "string",
            enum: ["field", "meeting", "public", "learning"],
          },
        },
      },
      CommunityItem: {
        type: "object",
        properties: {
          id: { type: "integer", description: "Numerical timestamp or sorting ID" },
          firestoreId: { type: "string", description: "Firestore document ID" },
          titleHi: { type: "string" },
          titleEn: { type: "string" },
          descHi: { type: "string", description: "HTML/Text summary description in Hindi" },
          descEn: { type: "string", description: "HTML/Text summary description in English" },
          detailsHi: { type: "string", description: "Detailed HTML breakdown in Hindi" },
          detailsEn: { type: "string", description: "Detailed HTML breakdown in English" },
          beneficiariesHi: { type: "string", example: "5,000+" },
          beneficiariesEn: { type: "string", example: "5,000+" },
          areaHi: { type: "string" },
          areaEn: { type: "string" },
          year: { type: "string", example: "2024" },
          icon: { type: "string", example: "🤝" },
          accent: { type: "string", example: "card-accent-green" },
          iconBg: { type: "string", example: "bg-[#E1F5EE] text-[#1D9E75]" },
        },
      },
      PaginatedCommunity: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/CommunityItem" },
          },
          total: { type: "integer", description: "Total community initiatives" },
          page: { type: "integer" },
          totalPages: { type: "integer" },
          limit: { type: "integer" },
        },
      },
      Analytics: {
        type: "object",
        properties: {
          totalViews: { type: "integer" },
          avgTime: { type: "string", example: "2m 34s" },
          topSection: { type: "string" },
          months: { type: "array", items: { type: "string" } },
          views: { type: "array", items: { type: "integer" } },
        },
      },
      Settings: {
        type: "object",
        properties: {
          lang: {
            type: "string",
            enum: ["hindi", "english", "both"],
            default: "hindi",
          },
          privacyProfile: { type: "boolean", default: true },
          showContact: { type: "boolean", default: true },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Bad Request — missing or invalid parameters",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { error: { type: "string" } },
            },
          },
        },
      },
      FirestoreError: {
        description: "Firestore / server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { error: { type: "string" } },
            },
          },
        },
      },
    },
  },
};

export default swaggerSpec;
