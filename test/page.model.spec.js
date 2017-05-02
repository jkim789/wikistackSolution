var Page = require('../models').Page
const chai = require('chai');
const expect = chai.expect;
var spies = require('chai-spies');
var marked = require('marked');

chai.use(spies);

describe('Page model', function () {
  before(function(){
    return Page.sync({force:true})
  })
  //
  var page;
  beforeEach(function (){
    page = Page.build();
  });


  describe('Virtuals', function () {
    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function () {
        page.urlTitle = 'some_title';
        console.log(page.route)
        expect(page.route).to.equal('/wiki/some_title')
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function () {
        // console.log(page.renderedContent)
        page.content = 'hi';
        // is this the worng way, is there a better way??????
        expect(page.renderedContent).to.equal(marked(page.content));
      });
    });
  });

  describe('Class methods', function () {
    before(function (done) {
      Page.create({
        title: 'foo',
        content: 'bar',
        tags: ['foo', 'bar']
      })
      .then(function () {
        done();
      })
      .catch(done);
    });
    describe('findByTag', function () {
      it('gets pages with the search tag', function (done) {
        // console.log(Page.findByTag('foo'));
        Page.findByTag('foo')
        .then(function(pages){
          var example = pages[0].title;
          expect(example).to.equal('foo');
          done();
        })
        .catch(done);
      });
      it('does not get pages without the search tag', function (done) {
        Page.findByTag('Bob')
        .then(function(pages){
          expect(pages).to.have.lengthOf(0);
          done();
        })
        .catch(done)
      });
    });
  });

  describe('Instance methods', function () {
    // var dataEntry = [{
    //   title: 'foo',
    //   urlTitle: 'foo',
    //   content: 'bar',
    //   tags: ['foo', 'bar']
    // },{
    //   title: 'foo111',
    //   urlTitle: 'foo12',
    //   content: 'bar111',
    //   tags: ['foo', 'bar111']
    // },{
    //   title: 'fooXXX',
    //   urlTitle: 'foo123',
    //   content: 'barXXX',
    //   tags: ['fooXXX', 'barXXX']
    // }]

    var instanceA = {
      title: 'foo',
      urlTitle: 'foo',
      content: 'bar',
      tags: ['foo', 'bar']
    };
    var instanceB = {
      title: 'foo111',
      urlTitle: 'foo12',
      content: 'bar111',
      tags: ['foo', 'bar111']
    };
    var instanceC = {
      title: 'fooXXX',
      urlTitle: 'foo123',
      content: 'barXXX',
      tags: ['fooXXX', 'barXXX']
    };

    var dataEntry = [instanceA, instanceB, instanceC];

    before(function (done) {
      Page.bulkCreate(dataEntry)
      .then(function () {
        done();
      })
      .catch(done);
    });

    describe('findSimilar', function () {
      it('never gets itself',function(done){
        dataEntry[0].findSimilar()
        .then(function(result){
          expect(result[0]).to.not.equal(dataEntry[0])
          done()
        })
        .catch(done)
      });
      it('gets other pages with any common tags');
      it('does not get other pages without any common tags');
    });
  });

  describe('Validations', function () {
    it('errors without title');
    it('errors without content');
    it('errors given an invalid status');
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating');
  });

});
