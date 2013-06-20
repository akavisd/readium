(function() {

  describe("navigator.epubReadingSystemObject", function() {
    it("is defined on the window.navigator", function() {
      return expect(window.navigator.epubReadingSystem).toBeDefined();
    });
    it("returns 'Readium' as the name", function() {
      return expect(window.navigator.epubReadingSystem.name).toEqual("Readium");
    });
    it("has a verison property", function() {
      return expect(window.navigator.epubReadingSystem.version).toBeDefined();
    });
    it("returns paginated as the layout style", function() {
      return expect(window.navigator.epubReadingSystem.layoutStyle).toEqual("paginated");
    });
    return describe('hasFeature()', function() {
      beforeEach(function() {
        return this.reader = window.navigator.epubReadingSystem;
      });
      it('reports support for dom-manipulation', function() {
        expect(this.reader.hasFeature("dom-manipulation")).toEqual(true);
        return expect(this.reader.hasFeature("dom-manipulation", "1.0")).toEqual(true);
      });
      it('reports support for layout-changes', function() {
        expect(this.reader.hasFeature("layout-changes")).toEqual(true);
        return expect(this.reader.hasFeature("layout-changes", "1.0")).toEqual(true);
      });
      it('reports no support for touch-events', function() {
        expect(this.reader.hasFeature("touch-events")).toEqual(false);
        return expect(this.reader.hasFeature("touch-events", "1.0")).toEqual(false);
      });
      it('reports support for mouse-events', function() {
        expect(this.reader.hasFeature("mouse-events")).toEqual(true);
        return expect(this.reader.hasFeature("mouse-events", "1.0")).toEqual(true);
      });
      it('reports support for keyboard-events', function() {
        expect(this.reader.hasFeature("keyboard-events")).toEqual(true);
        return expect(this.reader.hasFeature("keyboard-events", "1.0")).toEqual(true);
      });
      it('reports support for spine-scripting', function() {
        expect(this.reader.hasFeature("spine-scripting")).toEqual(true);
        return expect(this.reader.hasFeature("spine-scripting", "1.0")).toEqual(true);
      });
      return it('returns false if a version number that is not 1.0 is passed in', function() {
        return expect(this.reader.hasFeature("dom-manipulation", "2.0")).toEqual(false);
      });
    });
  });

}).call(this);
