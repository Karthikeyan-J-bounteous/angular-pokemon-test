import { TestBed } from '@angular/core/testing';
import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  let pipe: CapitalizePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapitalizePipe],
    });

    pipe = TestBed.inject(CapitalizePipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a single word to capitalized', () => {
    const input = 'hello';
    const result = pipe.transform(input);
    expect(result).toBe('Hello');
  });

  it('should transform multiple words separated by hyphens', () => {
    const input = 'hello-world';
    const result = pipe.transform(input);
    expect(result).toBe('Hello World');
  });

  it('should handle empty input', () => {
    const input = '';
    const result = pipe.transform(input);
    expect(result).toBe('');
  });

  it('should handle undefined input', () => {
    const input = undefined;
    const result = pipe.transform(input);
    expect(result).toBeUndefined();
  });

  it('should handle null input', () => {
    const input = null;
    const result = pipe.transform(input);
    expect(result).toBeNull();
  });

  it('should handle input with leading and trailing spaces', () => {
    const input = '  leading-trailing  ';
    const result = pipe.transform(input);
    expect(result).toBe('  Leading Trailing  ');
  });
});
