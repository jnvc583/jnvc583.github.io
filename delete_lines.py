import os

def delete_lines(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 删除第17到40行（索引16到39）
    if len(lines) > 16:
        new_lines = lines[:16] + lines[40:] if len(lines) > 40 else lines[:16]
    else:
        new_lines = lines  # 如果文件少于17行，不做任何更改
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html') and file != '404.html':
                file_path = os.path.join(root, file)
                delete_lines(file_path)
                print(f"Processed: {file_path}")

if __name__ == '__main__':
    main()