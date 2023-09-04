import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
export async function getComponentsList() {
  const fileNames = await readDirectory(
    '/apps/website/src/routes/docs/headless/(components)',
  );

  const components = [];

  for (let fileName of fileNames) {
    const rawContent = await readFile(
      `/apps/website/src/routes/docs/headless/(components)/${fileName}/index.mdx`,
    );

    const { data: frontmatter } = matter(rawContent);

    components.push({
      slug: fileName.replace('.mdx', ''),
      ...frontmatter,
    });
  }

  return components;
}

export async function loadComponent(slug: string) {
  try {
    const rawContent = await readFile(
      `/apps/website/src/routes/docs/headless/(components)/${slug}/index.mdx`,
    );

    const { data: frontmatter, content } = matter(rawContent);

    return { frontmatter, content };
  } catch (error) {
    return;
  }
}

function readFile(localPath: string) {
  return fs.readFile(path.join(process.cwd(), localPath), 'utf8');
}

function readDirectory(localPath: string) {
  return fs.readdir(path.join(process.cwd(), localPath));
}
