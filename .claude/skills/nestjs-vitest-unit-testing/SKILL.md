---
name: nestjs-vitest-unit-testing
description: Patterns for unit testing NestJS apps
---

# Backend Unit Testing Instructions

Use the following guidelines and patterns when writing unit tests for the backend NestJS application.

## Testing Framework & Setup

- **Framework**: Vitest (not Jest)
- **Test files**: Named `*.spec.ts` and colocated with the source file in `apps/api/src/`
- **Config**: `apps/api/vitest.config.ts` handles all test configuration

### Required Imports

Always import test utilities from `vitest`, not Jest:

```typescript
import { beforeEach, describe, expect, it, vi, afterEach, beforeAll, afterAll, Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
```

## Test File Structure

Follow this consistent structure for all test files:

```typescript
// 1. Imports - external libraries first, then internal modules
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SomeService } from './some.service';

// 2. Module mocks (vi.mock calls must be at top level)
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123'),
}));

// 3. Mock service/dependency definitions
const mockDependencyService = {
  methodOne: vi.fn(),
  methodTwo: vi.fn(),
};

// 4. Main describe block
describe('ServiceName', () => {
  let service: ServiceUnderTest;

  // 5. beforeEach with NestJS testing module setup
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceUnderTest,
        { provide: DependencyService, useValue: mockDependencyService },
      ],
    }).compile();

    service = module.get<ServiceUnderTest>(ServiceUnderTest);
  });

  // 6. Clear mocks after/before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 7. Basic definition test
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 8. Nested describe blocks for method grouping
  describe('methodName', () => {
    it('should do expected behavior', async () => {
      // Arrange
      mockDependencyService.methodOne.mockResolvedValue(expectedData);

      // Act
      const result = await service.methodName();

      // Assert
      expect(result).toEqual(expectedData);
    });
  });
});
```

## Mocking Patterns

### Mocking Services

Create mock objects at the module level with `vi.fn()` for each method:

```typescript
const mockRecordsService = {
  getAdmissions: vi.fn(),
  findOne: vi.fn(),
  updateStatus: vi.fn(),
};

// In beforeEach:
providers: [
  { provide: RecordsService, useValue: mockRecordsService },
]
```

### Mocking TypeORM Repositories

Use `getRepositoryToken` to mock database repositories:

```typescript
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from '../data/entities/notification.entity';

const mockRepository = {
  find: vi.fn(),
  save: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findBy: vi.fn(),
  delete: vi.fn(),
};

// In beforeEach:
providers: [
  { provide: getRepositoryToken(Notification), useValue: mockRepository },
]
```

### Mocking HTTP Clients (SAP_CLIENT, DHL_CLIENT)

Mock HTTP services with RxJS observables using `of()` for success and `throwError()` for errors:

```typescript
import { of, throwError } from 'rxjs';

const mockHttpService = {
  get: vi.fn(),
  post: vi.fn(),
};

// In tests:
mockHttpService.get.mockReturnValue(
  of({ data: { d: { results: mockData } } })
);

mockHttpService.post.mockReturnValue(
  throwError(() => new Error('Network error'))
);

// In beforeEach:
providers: [
  { provide: SAP_CLIENT, useValue: mockHttpService },
]
```

### Mocking Cache Manager

```typescript
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockCacheManager = {
  get: vi.fn(),
  set: vi.fn(),
};

providers: [
  { provide: CACHE_MANAGER, useValue: mockCacheManager },
]
```

### Mocking External Modules (AWS SDK, uuid, etc.)

Use `vi.mock()` at the top level of the file:

```typescript
// Must be at top level, outside describe blocks
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123'),
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(() => mockS3Client),
  PutObjectCommand: vi.fn((params) => ({ type: 'PutObjectCommand', params })),
  GetObjectCommand: vi.fn((params) => ({ type: 'GetObjectCommand', params })),
}));
```

### Mocking Utility Functions

When testing a module that imports utility functions:

```typescript
vi.mock('../utils/transform.utils', () => ({
  transformAdmissionsOrWithdrawals: vi.fn(),
  aggregateAdmissionWebhooks: vi.fn(),
}));

// In tests, cast to Mock for type safety:
import { transformAdmissionsOrWithdrawals } from '../utils/transform.utils';

(transformAdmissionsOrWithdrawals as Mock).mockReturnValue(expectedResult);
```

## Service Tests

### Standard Service Test Pattern

```typescript
describe('FilesService', () => {
  let service: FilesService;

  const mockS3Service = {
    uploadFile: vi.fn(),
    generatePresignedUrl: vi.fn(),
  };

  const mockFileMetadataService = {
    create: vi.fn(),
    findAll: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: S3Service, useValue: mockS3Service },
        { provide: FileMetadataService, useValue: mockFileMetadataService },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Using Factory Providers

For complex service instantiation:

```typescript
providers: [
  {
    provide: FilesService,
    useFactory: (
      fileMetadataService: FileMetadataService,
      s3Service: S3Service,
    ) => {
      return new FilesService(fileMetadataService, s3Service);
    },
    inject: [FileMetadataService, S3Service],
  },
  { provide: FileMetadataService, useValue: mockFileMetadataService },
  { provide: S3Service, useValue: mockS3Service },
]
```

## Controller Tests

```typescript
describe('ZonesController', () => {
  let controller: ZonesController;

  const mockZonesService = {
    getZones: vi.fn(),
  };

  vi.mock('@/utils/transform.utils', () => ({
    transformZones: vi.fn(),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZonesController],
      providers: [{ provide: ZonesService, useValue: mockZonesService }],
    }).compile();

    controller = module.get<ZonesController>(ZonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service and transform the result', async () => {
    mockZonesService.getZones.mockResolvedValue(mockZones);
    (transformZones as Mock).mockReturnValue(transformedZones);

    const result = await controller.getZones();

    expect(mockZonesService.getZones).toHaveBeenCalled();
    expect(transformZones).toHaveBeenCalledWith(mockZones);
    expect(result).toEqual(transformedZones);
  });
});
```

## Testing Pure Functions (Utilities)

For utility files with pure functions, tests are simpler:

```typescript
import { describe, expect, it } from 'vitest';
import { stripLeadingZero, extractHeaderValue } from './common.utils';

// Define test data at module level
const testCases = {
  singleLeadingZero: '01234',
  multipleLeadingZeros: '00001234',
  noLeadingZeros: '1234',
};

describe('stripLeadingZero', () => {
  it('should remove single leading zero', () => {
    const result = stripLeadingZero(testCases.singleLeadingZero);
    expect(result).toBe('1234');
  });
});
```

## Testing Pipes (Transforms)

```typescript
import { beforeEach, describe, expect, it } from 'vitest';
import { DhlBaseRequestConverterPipe } from './base-request-converter.pipe';

describe('DhlBaseRequestConverterPipe', () => {
  let pipe: DhlBaseRequestConverterPipe;

  beforeEach(() => {
    pipe = new DhlBaseRequestConverterPipe();
  });

  it('should transform valid payload with required fields', () => {
    const payload = {
      customerGUID: 'test-guid-123',
      CBPResponse: 'Test CBP response',
    };

    const result = pipe.transform(payload, {} as any);

    expect(result.customerGUID).toBe('test-guid-123');
    expect(result.CBPResponse).toBe('Test CBP response');
  });

  it('should throw BadRequestException when customerGUID is missing', () => {
    const payload = { CBPResponse: 'Test' };

    expect(() => pipe.transform(payload, {} as any)).toThrow(BadRequestException);
    expect(() => pipe.transform(payload, {} as any)).toThrow('customerGUID is required');
  });
});
```

## Testing Classes with Direct Instantiation

For non-NestJS classes like AuthContext:

```typescript
describe('AuthContext Tests', () => {
  const makeRequest = (groups?: string): Partial<Request> => ({
    headers: groups ? { 'x-user-groups': groups } : {},
  });

  const makeAuthConfig = (userGroups?: string): AuthConfig => ({
    userGroups,
  });

  it('should set isUSAdmin to true if user is in a US admin group', () => {
    const request = makeRequest('FTZ_system_US_DEV,other_group') as Request;
    const config = makeAuthConfig();
    const ctx = new AuthContext(request, config);
    
    expect(ctx.isUSAdmin).toBe(true);
    expect(ctx.isPRAdmin).toBe(false);
  });
});
```

## Exception Testing Patterns

### Testing Thrown Exceptions

```typescript
it('should throw BadRequestException when file is missing', async () => {
  await expect(
    service.uploadFile(email, name, categories, undefined)
  ).rejects.toThrow(BadRequestException);
});

it('should throw with specific message', async () => {
  await expect(
    service.uploadFile(email, name, categories, undefined)
  ).rejects.toThrow('No valid file provided');
});

// Testing both exception type and message:
it('should throw BadRequestException with message', async () => {
  await expect(
    service.uploadFile(email, name, categories, undefined)
  ).rejects.toThrow(new BadRequestException('No valid file provided'));
});
```

### Testing Synchronous Throws

```typescript
it('should throw BadRequestException on null payload', () => {
  expect(() => pipe.transform(null as any, {} as any)).toThrow(BadRequestException);
  expect(() => pipe.transform(null as any, {} as any)).toThrow('Request payload is required');
});
```

## Mock Data Organization

### Define Test Data at Module Level

```typescript
const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test-document.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: Buffer.from('mock file content'),
  size: 1024 * 1024,
  destination: '',
  filename: '',
  path: '',
  stream: {} as any,
};

const mockFileMetadata = {
  id: 'test-file-id',
  filename: 'test-document.pdf',
  s3_object_key: 'normalized-s3-key',
  uploader_email: 'test@example.com',
};
```

### Using Spread for Test Variations

```typescript
it('should throw when file has no buffer', async () => {
  const invalidFile = { ...mockFile, buffer: undefined as any };
  await expect(service.uploadFile(invalidFile)).rejects.toThrow();
});

it('should handle oversized files', async () => {
  const oversizedFile = { ...mockFile, size: MAX_FILE_SIZE_BYTES + 1 };
  await expect(service.uploadFile(oversizedFile)).rejects.toThrow();
});
```

## Spying and Mocking Instance Methods

### Spying on Logger

```typescript
beforeAll(() => {
  vi.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
});
```

### Accessing Private Properties for Testing

```typescript
it('should cache zones data', async () => {
  mockHttpService.get.mockReturnValue(of({ data: { d: { results: mockZones } } }));
  
  await service.getZones();
  
  expect(service['cachedZones']).toEqual(mockZones);
});

it('should return cached data when cache is valid', async () => {
  service['cachedZones'] = mockZones;
  
  const result = await service.getZones();
  
  expect(result).toEqual(mockZones);
  expect(mockHttpService.get).not.toHaveBeenCalled();
});
```

## Async Testing Patterns

### Testing Promises

```typescript
it('should resolve with expected data', async () => {
  mockService.getData.mockResolvedValue(mockData);
  
  const result = await service.fetchData();
  
  expect(result).toEqual(mockData);
});

it('should reject with error', async () => {
  mockService.getData.mockRejectedValue(new Error('Failed'));
  
  await expect(service.fetchData()).rejects.toThrow('Failed');
});
```

### Testing Observables with RxJS

```typescript
import { of, throwError } from 'rxjs';

it('should handle observable success', async () => {
  mockHttpService.get.mockReturnValue(of({ data: expectedResponse }));
  
  const result = await service.fetchFromApi();
  
  expect(result).toEqual(expectedResponse);
});

it('should handle observable error', async () => {
  mockHttpService.get.mockReturnValue(
    throwError(() => new HttpException('API Error', 500))
  );
  
  await expect(service.fetchFromApi()).rejects.toThrow(HttpException);
});
```

## Sequential Mock Returns

```typescript
it('should handle multiple calls with different responses', async () => {
  mockSapService.get
    .mockReturnValueOnce(throwError(() => new HttpException('Not Found', 404)))
    .mockReturnValueOnce(of({ data: payload1 }))
    .mockReturnValueOnce(of({ data: payload2 }));

  const result = await service.getAllPayloadsWithUid('GROUP-123');

  expect(mockSapService.get).toHaveBeenCalledTimes(3);
  expect(result).toHaveLength(2);
});
```

## Assertion Patterns

### Verifying Function Calls

```typescript
expect(mockService.method).toHaveBeenCalled();
expect(mockService.method).toHaveBeenCalledTimes(2);
expect(mockService.method).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockService.method).toHaveBeenCalledWith(
  expect.objectContaining({ key: 'value' })
);
expect(mockService.method).not.toHaveBeenCalled();
```

### Object Matching

```typescript
expect(result).toEqual(expectedObject);
expect(result).toMatchObject({ key: 'value' });
expect(mockService.create).toHaveBeenCalledWith(
  expect.objectContaining({
    filename: 'test.pdf',
    record_type: 'admission',
  })
);
```

### String Matching

```typescript
expect(mockHttpService.get).toHaveBeenCalledWith(
  expect.stringContaining("(Zzuid eq 'record1')")
);
```

## Test Naming Conventions

- Start with "should" for behavior descriptions
- Be specific about the condition and expected outcome
- Group related tests in nested `describe` blocks

```typescript
describe('uploadFile', () => {
  describe('file validation', () => {
    it('should throw BadRequestException when no file is provided', async () => {});
    it('should throw BadRequestException when file has no buffer', async () => {});
    it('should throw BadRequestException when file size exceeds limit', async () => {});
  });

  describe('successful upload', () => {
    it('should upload file successfully with all parameters', async () => {});
    it('should upload file successfully without record_number', async () => {});
  });
});
```

## Running Tests

```bash
# Run all backend tests
cd backend && npm run test

# Run tests in watch mode
cd backend && npm run test:watch

# Run with coverage
cd backend && npm run test:cov

# Run specific test file
cd backend && npx vitest run src/files/files.service.spec.ts

# Run tests matching pattern
cd backend && npx vitest run -t "should upload file"
```

## Common Mistakes to Avoid

1. **Using Jest syntax**: Use `vi.fn()`, `vi.mock()`, `vi.spyOn()` instead of `jest.*`
2. **Forgetting vi.clearAllMocks()**: Always clear mocks in beforeEach
3. **Not awaiting async tests**: Always `await` async operations or use proper Promise assertions
4. **Using any type**: Define proper mock types; avoid `any` when possible
5. **Hardcoded dates**: Use `vi.setSystemTime()` for time-dependent tests
6. **Not testing error cases**: Always test both success and failure paths
7. **Missing mock definitions**: Define all methods your code will call on mocked dependencies
