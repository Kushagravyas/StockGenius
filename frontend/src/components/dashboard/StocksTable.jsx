/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { Table, Input, Select } from "antd";
import { Button } from "@/components/ui/button";
import { Star, StarOff, Info } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import { FaChartLine, FaRobot } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";
import { getAllStocks } from "@/store/slices/stockSlice";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme/theme-provider";
import { getThemeColors } from "@/theme/antd.config";

const { Search } = Input;
const { Option } = Select;

const StocksTable = ({
  data = [],
  loading = false,
  currentPage = 1,
  totalStocks = 0,
  selectedStock = null,
  onStockSelect,
  onWatchlistToggle,
  isStockInWatchlist,
  sectors = [],
  industries = [],
  onShowChart,
  onShowAnalysis,
}) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [pagination, setPagination] = useState({
    current: currentPage,
    pageSize: 10,
    total: totalStocks,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} stocks`,
    style: {
      padding: "0px 16px 0px 0px",
    },
  });

  // Create memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        fetchData({
          page: 1,
          search: value,
          sector: selectedSector,
          industry: selectedIndustry,
        });
      }, 800),
    [selectedSector, selectedIndustry]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Updated search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 }));

    if (!value) {
      // Immediately reset search when cleared
      debouncedSearch.cancel();
      fetchData({
        page: 1,
        search: "",
        sector: selectedSector,
        industry: selectedIndustry,
      });
    } else {
      debouncedSearch(value);
    }
  };

  // Fetch data based on filters and pagination
  const fetchData = (params = {}) => {
    dispatch(
      getAllStocks({
        page: params.page || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        search: params.search || searchText,
        sector: params.sector || selectedSector,
        industry: params.industry || selectedIndustry,
      })
    );
  };

  // Handle table change (pagination, filters, sorter)
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    fetchData({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  // Reset pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({
      page: 1,
      sector: selectedSector,
      industry: selectedIndustry,
    });
  }, [selectedSector, selectedIndustry]);

  // Update pagination when props change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      total: totalStocks,
    }));
  }, [currentPage, totalStocks]);

  // Column definitions with highlighted row
  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: 100,
      fixed: "left",
      render: (text, record) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer pl-2 font-bold whitespace-nowrap"
        >
          {text}
          {isStockInWatchlist(record.symbol) && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block ml-1"
            >
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 inline" />
            </motion.span>
          )}
        </motion.div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "auto",
      ellipsis: true,
      fixed: "left",
      render: (text) => (
        <motion.div
          whileHover={{ x: 3 }}
          className="cursor-pointer font-medium truncate max-w-[200px] sm:max-w-none"
        >
          {text}
        </motion.div>
      ),
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: 200,
      ellipsis: true,
      responsive: ["md"],
      render: (text) => (
        <Badge variant="outline" className="bg-primary/5 text-xs max-w-[200px] truncate">
          {text}
        </Badge>
      ),
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      width: 200,
      ellipsis: true,
      responsive: ["lg"],
      render: (text) => (
        <Badge
          variant="outline"
          className="bg-secondary/5 text-xs max-w-[180px] truncate"
        >
          {text}
        </Badge>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onWatchlistToggle(record);
          }}
          className="flex items-center justify-center w-full"
        >
          {isStockInWatchlist(record.symbol) ? (
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 drop-shadow-glow" />
          ) : (
            <StarOff className="h-4 w-4 text-muted-fg hover:text-yellow-400" />
          )}
        </motion.button>
      ),
    },
  ];

  // Updated Search Input with react-icon
  const SearchIcon = () => <IoSearchOutline className="h-4 w-4 text-muted-fg" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Responsive Filters with Action Buttons */}
      <motion.div
        className={`bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-primary/10 shadow-lg`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {/* Search and Filters Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Search
            placeholder="Search stocks..."
            allowClear
            onChange={handleSearchChange}
            className="w-full md:w-64 hover-float"
            prefix={<SearchIcon />}
            value={searchText}
          />
          <Select
            className="w-full md:w-48 hover-float"
            placeholder="Filter by sector"
            allowClear
            onChange={(value) => setSelectedSector(value)}
            classNames={{
              popup: {
                root: "bg-card border border-primary/20",
              },
            }}
            popupClassName={`theme-${theme}-dropdown`}
          >
            {sectors.map((sector) => (
              <Option key={sector} value={sector}>
                {sector}
              </Option>
            ))}
          </Select>
          <Select
            className="w-full md:w-48 hover-float"
            placeholder="Filter by industry"
            allowClear
            onChange={(value) => setSelectedIndustry(value)}
            classNames={{
              popup: {
                root: "bg-card border border-primary/20",
              },
            }}
            popupClassName={`theme-${theme}-dropdown`}
          >
            {industries.map((industry) => (
              <Option key={industry} value={industry}>
                {industry}
              </Option>
            ))}
          </Select>
        </div>
      </motion.div>

      {/* Selected Stock Info */}
      <AnimatePresence>
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/20 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 sm:items-center">
              {/* Stock Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center flex-col sm:flex-row gap-2 sm:gap-3">
                  <h3 className="text-lg font-bold whitespace-nowrap">
                    {selectedStock.symbol}
                  </h3>
                  <Badge className="bg-primary/20 text-primary text-xs whitespace-nowrap">
                    {selectedStock.sector}
                  </Badge>
                </div>
                <p className="text-sm text-muted-fg mt-1 truncate max-w-[300px]">
                  {selectedStock.name}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  onClick={onShowChart}
                  size="sm"
                  className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary hover-float whitespace-nowrap"
                >
                  <FaChartLine className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Chart</span>
                </Button>
                <Button
                  onClick={onShowAnalysis}
                  size="sm"
                  className="bg-secondary/10 hover:bg-secondary/20 text-secondary hover:text-secondary hover-float whitespace-nowrap"
                >
                  <FaRobot className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">AI Analysis</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{
            x: 640, // Minimum width before horizontal scroll
            y: "calc(100vh - 350px)",
          }}
          rowKey="symbol"
          size="small"
          className={`bg-card rounded-xl shadow-xl overflow-hidden [&_.ant-table-cell]:!py-3 theme-${theme}-table`}
          rowClassName={(record) =>
            selectedStock?.symbol === record.symbol
              ? `selected-row shimmer theme-${theme}-selected-row`
              : `hover:bg-${themeColors.borderColor}/20 theme-${theme}-row`
          }
          sticky="true"
          tableLayout="fixed"
          onRow={(record) => ({
            onClick: () => onStockSelect(record),
            className: `cursor-pointer transition-all duration-300 theme-${theme}-table-row`,
          })}
          locale={{
            emptyText: (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <Info className="h-12 w-12 text-muted-fg mx-auto mb-4 opacity-50" />
                <p className="text-muted-fg">No stocks found</p>
                <p className="text-sm text-foreground/70">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ),
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default StocksTable;
