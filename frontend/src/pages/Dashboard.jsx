/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaRobot } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import StocksTable from "@/components/dashboard/StocksTable";
import TradingChart from "@/components/dashboard/TradingChart";
import { getWatchlist, toggleWatchlist } from "@/store/slices/watchlistSlice";
import { clearAnalysis, getAIAnalysis } from "@/store/slices/aiSlice";
import { getAllStocks } from "@/store/slices/stockSlice";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner";
import StepLoader from "@/components/ui/StepLoader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Maximize2, Minimize2, RefreshCw, Star } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { watchlist, loading: watchlistLoading } = useSelector(
    (state) => state.watchlist
  );
  const {
    stocks,
    loading: stocksLoading,
    totalStocks,
    totalPages,
    currentPage,
  } = useSelector((state) => state.stocks);

  const {
    analysis,
    loading: analysisLoading,
    loadingStep,
  } = useSelector((state) => state.ai);

  const [selectedStock, setSelectedStock] = useState(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [interval, setInterval] = useState("1min");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("chart");
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    dispatch(getWatchlist());
    dispatch(getAllStocks());
  }, [dispatch]);

  {
    /*
  Extract unique sectors and industries from stocks (DSA Knowledge)
  1. creating Array of (by using [])
  2. unique (by using Set data structure (Set appends unique values to the array)) 
  3. adding new unique elements instead of overriding by using spread operator(...)
  */
  }
  const sectors = [...new Set(stocks.map((stock) => stock.sector))]
    .filter(Boolean)
    .sort();
  const industries = [...new Set(stocks.map((stock) => stock.industry))]
    .filter(Boolean)
    .sort();

  const handleShowChart = () => {
    if (!selectedStock) {
      toast.error("Please select a stock to view chart");
      return;
    }
    setShowChartModal(true);
    setActiveTab("chart");
  };

  const handleAIAnalysis = useCallback(async () => {
    if (!selectedStock) return toast.error("Please select a stock for AI analysis");

    dispatch(clearAnalysis());
    setActiveTab("analysis");
    setShowChartModal(true);

    try {
      await dispatch(getAIAnalysis(selectedStock.symbol));
      toast.success(`Analysis loaded for ${selectedStock.symbol}`);
    } catch (error) {
      toast.error(`Failed to load analysis: ${error.message}`);
    }
  }, [dispatch, selectedStock]);

  // useEffect to watch for selectedStock changes
  useEffect(() => {
    if (selectedStock && showChartModal && activeTab === "analysis") {
      handleAIAnalysis();
    }
  }, [activeTab, handleAIAnalysis, selectedStock, showChartModal]);

  // Simplified handlers
  const handleStockSelect = useCallback(
    (stock, showToast = true) => {
      if (!stock) return toast.error("Please select a valid stock");

      if (selectedStock?.symbol !== stock.symbol) {
        dispatch(clearAnalysis());
        setSelectedStock(stock);
        // Only show toast when explicitly selecting from table
        if (showToast) {
          toast.success(`Selected ${stock.symbol}`);
        }
      }
    },
    [dispatch, selectedStock]
  );

  const handleWatchlistToggle = async (stock) => {
    try {
      await dispatch(toggleWatchlist({ symbol: stock.symbol, name: stock.name }));
      dispatch(getWatchlist());
      toast.success(
        isStockInWatchlist(stock.symbol)
          ? `Removed ${stock.symbol} from watchlist`
          : `Added ${stock.symbol} to watchlist`
      );
    } catch (error) {
      toast.error(`Failed to update watchlist: ${error.message}`);
    }
  };

  const isStockInWatchlist = (symbol) => {
    return watchlist.some((stock) => stock.symbol === symbol);
  };

  const intervals = [
    { label: "1min", value: "1min" },
    { label: "5min", value: "5min" },
    { label: "15min", value: "15min" },
    { label: "1D", value: "1D" },
  ];

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    // Clear existing data when interval changes
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTabChange = async (newTab) => {
    setActiveTab(newTab);
    if (newTab === "analysis" && !analysis) {
      try {
        await dispatch(getAIAnalysis(selectedStock.symbol));
        toast.success(`Analysis loaded for ${selectedStock.symbol}`);
      } catch (error) {
        toast.error(`Failed to load analysis: ${error.message}`);
      }
    }
  };

  // Watchlist modal added at the last
  const WatchlistModal = ({ isOpen, onClose }) => (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[95vw] sm:w-[400px] h-[80vh] max-w-none m-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Watchlist</h3>
        <Button variant="ghost" size="sm" onClick={() => dispatch(getWatchlist())}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {watchlistLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : watchlist.length > 0 ? (
        <div className="space-y-2">
          {watchlist.map((stock) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedStock?.symbol === stock.symbol
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted/50 border border-transparent"
              }`}
              onClick={() => {
                handleStockSelect(stock, false); // Pass false to prevent toast
                onClose();
              }}
            >
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-xs text-muted-fg truncate">{stock.name}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWatchlistToggle(stock);
                }}
              >
                {isStockInWatchlist(stock.symbol) ? (
                  <FaChartLine className="h-4 w-4 text-primary" />
                ) : (
                  <FaChartLine className="h-4 w-4 text-muted-fg" />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-fg">
          <p>No stocks in watchlist</p>
          <p className="text-sm mt-2">Click the star icon on stocks to add them</p>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full p-4 flex flex-col"
      >
        {/* Stocks Table with integrated action buttons */}
        <div className="flex-1 p-4 max-h-fit bg-card rounded-xl shadow-md overflow-hidden border border-muted">
          <StocksTable
            data={stocks}
            loading={stocksLoading}
            totalStocks={totalStocks}
            currentPage={currentPage}
            totalPages={totalPages}
            sectors={sectors}
            industries={industries}
            selectedStock={selectedStock}
            onStockSelect={handleStockSelect}
            onWatchlistToggle={handleWatchlistToggle}
            isStockInWatchlist={isStockInWatchlist}
            // Action Buttons for Chart and AI Analysis
            onShowChart={handleShowChart}
            onShowAnalysis={handleAIAnalysis}
          />
        </div>

        {/* Modals */}
        {/* Combined Chart and Analysis Modal */}
        <AnimatePresence>
          {showChartModal && (
            <Modal
              isOpen={showChartModal}
              onClose={() => setShowChartModal(false)}
              className={
                isFullscreen
                  ? "fixed inset-0 w-screen h-screen m-0 p-0"
                  : "w-[95vw] sm:w-[90vw] md:w-[85vw] h-[90vh] max-w-none m-4"
              }
            >
              <div className="h-full flex flex-col">
                {/* Header with Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b gap-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold flex items-center">
                      {selectedStock?.symbol}
                      <span className="ml-2 text-sm font-normal text-muted-fg hidden sm:inline">
                        {selectedStock?.name}
                      </span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Tabs
                      value={activeTab}
                      onValueChange={handleTabChange}
                      className="w-full sm:w-auto"
                    >
                      <TabsList>
                        <TabsTrigger
                          value="chart"
                          className="flex items-center gap-1 text-[#35b0ab]"
                        >
                          <FaChartLine className="h-3.5 w-3.5" /> Chart
                        </TabsTrigger>
                        <TabsTrigger
                          value="analysis"
                          className="flex items-center gap-1 text-[#35b0ab]"
                        >
                          <FaRobot className="h-3.5 w-3.5" /> AI Analysis
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 ml-auto">
                      {/* Watchlist Button added for Mobile */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowWatchlistModal(true)}
                        className="md:hidden"
                      >
                        <Star className="h-4 w-4" />
                      </Button>

                      <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col md:flex-row min-h-0">
                  <div className="flex-1 min-w-0 p-4 overflow-hidden">
                    {/* Intervals , Chart and AI Analysis Tabs */}
                    <Tabs value={activeTab} className="h-full">
                      {/* Intervals and Chart */}
                      <TabsContent value="chart" className="h-full p-0 m-0 border-none">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between p-2 bg-card/50">
                            <div className="flex gap-2">
                              {intervals.map((int) => (
                                <Button
                                  key={int.value}
                                  size="sm"
                                  variant={interval === int.value ? "default" : "outline"}
                                  onClick={() => handleIntervalChange(int.value)}
                                  className="text-xs"
                                >
                                  {int.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1 p-0">
                            <TradingChart
                              symbol={selectedStock?.symbol}
                              interval={interval}
                              ref={chartRef}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      {/* AI Analysis Tab */}
                      <TabsContent
                        value="analysis"
                        className="h-full p-4 overflow-hidden"
                      >
                        {analysisLoading ? (
                          <StepLoader
                            currentStep={loadingStep}
                            isLoading={analysisLoading}
                          />
                        ) : analysis ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <div className="bg-card/50 p-6 rounded-xl border border-primary/10">
                              <h3 className="text-xl font-bold mb-4">
                                AI Analysis for {selectedStock?.symbol}
                              </h3>
                              <div
                                className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-fg"
                                dangerouslySetInnerHTML={{
                                  __html: (typeof analysis.suggestion === "string"
                                    ? analysis.suggestion
                                    : analysis.suggestion.suggestion
                                  )
                                    .replace(/--- START ANALYSIS FORMAT ---\n?/g, "")
                                    .replace(/--- END FORMAT ---\n?/g, "")
                                    .replace(/\n/g, "<br/>")
                                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                    .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                                }}
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-muted-fg">
                            <FaRobot className="h-16 w-16 mb-4 opacity-20" />
                            <p>Select a stock and click "AI Analysis" to get started</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Hide watchlist sidebar on mobile */}
                  <div className="hidden md:block w-80 border-l bg-muted/10 p-4 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Watchlist</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(getWatchlist())}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Display Watchlist */}
                    {watchlistLoading ? (
                      <div className="flex justify-center">
                        <Loader />
                      </div>
                    ) : watchlist.length > 0 ? (
                      <div className="space-y-2">
                        {watchlist.map((stock) => (
                          <motion.div
                            key={stock.symbol}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedStock?.symbol === stock.symbol
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-muted/50 border border-transparent"
                            }`}
                            onClick={() => handleStockSelect(stock, false)} // Pass false to prevent toast
                          >
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-muted-fg truncate">
                                {stock.name}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWatchlistToggle(stock);
                              }}
                            >
                              {isStockInWatchlist(stock.symbol) ? (
                                <FaChartLine className="h-4 w-4 text-primary" />
                              ) : (
                                <FaChartLine className="h-4 w-4 text-muted-fg" />
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-fg">
                        <p>No stocks in watchlist</p>
                        <p className="text-sm mt-2">
                          Click the star icon on stocks to add them
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Add Watchlist Modal */}
        <AnimatePresence>
          {showWatchlistModal && (
            <WatchlistModal
              isOpen={showWatchlistModal}
              onClose={() => setShowWatchlistModal(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard;
