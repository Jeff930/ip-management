import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { auditResolver } from './audit.resolver';

describe('auditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => auditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
