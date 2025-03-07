import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { ipResolver } from './ip.resolver';

describe('ipResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => ipResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
