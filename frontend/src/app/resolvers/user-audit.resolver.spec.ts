import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userAuditResolver } from './user-audit.resolver';

describe('userAuditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userAuditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
