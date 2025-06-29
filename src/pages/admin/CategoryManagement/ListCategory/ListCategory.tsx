import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Box, Chip, Collapse, Dialog } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { categoryApi } from "~/services/axios.category";
import Category from "~/types/category";
import { useNavigate } from "react-router-dom";
import DeleteCategory from "../DeleteCategory/DeleteCategory";



function ListCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  //diaglog delete category
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll();
      
      const categoriesData: Category[] = response || []; 
      
      // Kiểm tra nếu không phải mảng
      if (!Array.isArray(categoriesData)) {
        throw new Error("Expected array but got: " + typeof categoriesData);
      }

      const categoryMap = new Map<string, Category>();
      const rootCategories: Category[] = [];
      
      // Tạo map và xác định danh mục gốc
      categoriesData.forEach(category => {
        categoryMap.set(category.id, { 
          ...category, 
          subCategories: [] 
        });
        
        if (!category.parentCategoryId) {
          rootCategories.push(categoryMap.get(category.id)!);
        }
      });
      
      // Thêm danh mục con vào danh mục cha
      categoriesData.forEach(category => {
        if (category.parentCategoryId && categoryMap.has(category.parentCategoryId)) {
          categoryMap.get(category.parentCategoryId)!.subCategories!.push(
            categoryMap.get(category.id)!
          );
        }
      });
      
      setCategories(rootCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoryRow = (category: Category, level: number = 0) => {
    const hasSubCategories = category.subCategories && category.subCategories.length > 0;
    const isExpanded = expandedCategories[category.id];

    return (
      <React.Fragment key={category.id}>
        <TableRow>
          <TableCell sx={{ paddingLeft: `${level * 20 + 8}px` }}>
            {hasSubCategories ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => toggleCategoryExpand(category.id)}
                sx={{ marginRight: 1 }}
              >
                {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            ) : (
              <Box component="span" sx={{ width: 40, display: 'inline-block' }} />
            )}
            {level > 0 && (
              <SubdirectoryArrowRightIcon 
                sx={{ 
                  verticalAlign: 'middle', 
                  marginRight: 1,
                  color: 'text.secondary'
                }} 
              />
            )}
            {category.name}
          </TableCell>
          <TableCell>
            <Tooltip title={category.description}>
              <span>
                {category?.description?.length > 30
                  ? `${category.description.substring(0, 30)}...`
                  : category.description}
              </span>
            </Tooltip>
          </TableCell>
          {/* <TableCell align="center">
            {category.parentCategoryName ? (
              <Chip 
                label={category.parentCategoryName} 
                size="small" 
                variant="outlined"
              />
            ) : (
              <Chip 
                label="Danh mục gốc" 
                color="primary" 
                size="small" 
                variant="outlined" 
              />
            )}
          </TableCell>
          <TableCell align="center">
            <Chip 
              label={category.productCount} 
              color={category.productCount > 0 ? "success" : "default"}
              size="small" 
            />
          </TableCell> */}
          {/* <TableCell align="center">
            <Chip 
              label={category.subCategoryCount} 
              color={category.subCategoryCount > 0 ? "info" : "default"}
              size="small" 
            />
          </TableCell> */}
          <TableCell align="center">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                "& .MuiIconButton-root": {
                  borderRadius: 2,
                },
              }}
            >
              <Tooltip title="Xem chi tiết">
                <IconButton onClick={() => { navigate(`detail/${category.id}`); }}>
                  <VisibilityOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Chỉnh sửa">
                <IconButton color="primary" onClick={() => { navigate(`edit/${category.id}`); }}>
                  <CreateOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Thêm danh mục con">
                <IconButton color="success" onClick={()=>{navigate('create')}}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
             <Tooltip title="Xóa">
              <IconButton 
                color="error" 
                onClick={() => {
                  setCategoryToDelete({
                    id: category.id,
                    name: category.name
                  });
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            </Box>
          </TableCell>
        </TableRow>

        {hasSubCategories && (
          <TableRow>
            <TableCell style={{ padding: 0 }} colSpan={6}>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <TableContainer component={Paper} sx={{ backgroundColor: '#f9f9f9' }}>
                  <Table size="small" aria-label="subcategories">
                    <TableBody>
                      {category.subCategories!.map(subCat => renderCategoryRow(subCat, level + 1))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  if (loading) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Đang tải danh mục...</Box>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="category table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: '30%' }}>
                <TableSortLabel>Tên danh mục</TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '25%' }}>Mô tả</TableCell>
              {/*<TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Danh mục cha</TableCell>
               <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Số sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Số danh mục con</TableCell> */}
              <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map(category => renderCategoryRow(category))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Không có danh mục nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
  
      {/* Dialog delete category */}
      {categoryToDelete && (
        <DeleteCategory
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          categoryId={categoryToDelete.id}
          categoryName={categoryToDelete.name}
          onDeleteSuccess={() => {
            fetchCategories(); 
          }}
        />
      )}
    </>
  );
}

export default ListCategory;