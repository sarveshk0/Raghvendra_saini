/**
 * GET /api/swagger-spec
 * Returns the raw OpenAPI 3.0 JSON spec (used by swagger-ui-react)
 */
import swaggerSpec from '../../../lib/swaggerSpec';

export async function GET() {
  return Response.json(swaggerSpec);
}
