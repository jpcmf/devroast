-- Database initialization script for DevRoast
-- This script is automatically executed when PostgreSQL container starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums if they don't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'programming_language') THEN
    CREATE TYPE programming_language AS ENUM (
      'javascript',
      'typescript',
      'python',
      'rust',
      'golang',
      'java',
      'csharp',
      'php',
      'ruby',
      'kotlin',
      'sql',
      'html',
      'css',
      'json',
      'yaml',
      'bash',
      'other'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_type') THEN
    CREATE TYPE feedback_type AS ENUM (
      'roast',
      'standard',
      'review'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity_level') THEN
    CREATE TYPE severity_level AS ENUM (
      'critical',
      'high',
      'medium',
      'low',
      'minimal'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_category') THEN
    CREATE TYPE issue_category AS ENUM (
      'naming',
      'performance',
      'security',
      'error_handling',
      'code_style',
      'logic',
      'complexity',
      'best_practices',
      'documentation',
      'dependency_management'
    );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'badge') THEN
    CREATE TYPE badge AS ENUM (
      'worst_naming',
      'missing_error_handling',
      'security_nightmare',
      'spaghetti_code',
      'no_documentation',
      'performance_disaster',
      'abandoned_variables',
      'magic_numbers',
      'cyclomatic_chaos',
      'regex_nightmare'
    );
  END IF;
END $$;

-- Tables will be created by Drizzle migrations
-- This initialization script only sets up the PostgreSQL extensions and types
